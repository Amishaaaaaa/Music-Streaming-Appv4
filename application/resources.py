from flask_restful import Resource, Api, reqparse, marshal_with, fields, marshal
from flask_security import auth_required, roles_required, current_user
from sqlalchemy import or_
from flask import jsonify
from .models import db, User, Song, Album, Playlist, Rating
# from .instances import cache

api = Api(prefix='/api')

#--------------------------get and post for users--------------

individual_parser = reqparse.RequestParser()
individual_parser.add_argument("username", type = str, help = "username is required and should be a string", required = True)
individual_parser.add_argument("email", type = str, help = "email is required and should be an string", required = True)
individual_parser.add_argument("password", type = str, help = "password is required and should be a string", required = True)
individual_parser.add_argument("active", type = bool, help = "active is required and should be a boolean", required = True)
individual_parser.add_argument("fs_uniquifier", type = str, help = "fs_uniquifier is required and should be a string", required = True)

individual_fields = {
    'id': fields.Integer,
    'username': fields.String,
    'email': fields.String,
    'password': fields.String,
    'active': fields.Boolean,
    'fs_uniquifier': fields.String
}

class Individual(Resource):
    @marshal_with(individual_fields)
    def get(self):
        all_individual = User.query.all()
        return all_individual
    
    def post(self):
        args = individual_parser.parse_args()
        individual = User(**args)
        db.session.add(individual)
        db.session.commit()
        return {"message": "Individual added"}
api.add_resource(Individual, '/individual')


#-----------------get and post for songs---------------------

parser = reqparse.RequestParser()
parser.add_argument("name", type = str, help = "name is required and should be a string", required = True)
parser.add_argument("genre", type = str, help = "genre is required and should be a string", required = True)
parser.add_argument("duration", type = str, help = "duration is required and should be a string", required = True)
parser.add_argument("lyrics", type = str, help = "lyrics is required and should be a string", required = True)
parser.add_argument("date_added", type = str, help = "date_added is required and should be a string", required = True) 
parser.add_argument("album_id", type=int)
#custom field
class Creator(fields.Raw):
    def format(self, user):
        return user.email

music_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'genre': fields.String, 
    'duration': fields.String,
    'lyrics': fields.String,
    'date_added': fields.String,
    'is_approved': fields.Boolean,
    'creator': Creator,
    'album_id': fields.Integer,
    'artist_id': fields.Integer
}

class Music(Resource):
    @auth_required("token")
    # @cache.cached(timeout=50)
    def get(self):
        all_music = Song.query.all()
        print(current_user.username)
        if not "admin" in current_user.roles:
            song = Song.query.filter(
                or_(Song.is_approved == True, Song.creator == current_user, Song.artist_id == current_user.id)).all()
        else:
            song = Song.query.all()
        
        if len(song) > 0:
            return jsonify(marshal(song, music_fields))
        else:
            return {"message": " No Resource Found "}

    @auth_required("token")
    @roles_required("creator")
    def post(self):
        args = parser.parse_args()
        song = Song(name=args.get("name"), 
                    genre=args.get("genre"), 
                    duration=args.get("duration"), 
                    lyrics=args.get("lyrics"), 
                    date_added=args.get("date_added"),
                    album_id=args.get("album_id"),
                    artist_id=current_user.id)
        db.session.add(song)
        db.session.commit()
        return {"message": "Song added"}
api.add_resource(Music, '/music')  


#-------------------get and post for album---------------------

album_parser = reqparse.RequestParser()
album_parser.add_argument('name', type=str, required=True, help='Name of the album is required')
album_parser.add_argument('release_date', type=str, required=True, help='Release date of the album is required')

album_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'release_date': fields.String,
    'artist_id': fields.Integer
}

class Albums(Resource):
    @auth_required("token")
    def get(self):
        if not "admin" in current_user.roles:
            albums = Album.query.filter(
                or_(Album.is_approved == True, Album.artist_id == current_user.id)).all()
        else:
            albums = Album.query.all()
        
        if len(albums) > 0:
            return jsonify(marshal(albums, album_fields))
        else:
            return {"message": " No Resource Found "}

    @auth_required("token")
    @roles_required("creator")
    def post(self):
        args = album_parser.parse_args()
        album = Album(name=args.get("name"), 
                      release_date=args.get("release_date"), 
                      artist_id=current_user.id)
        db.session.add(album)
        db.session.commit()
        return {"message": "Album added"}

api.add_resource(Albums, '/album') 

#---------------------update song-----------------

update_parser = reqparse.RequestParser()
update_parser.add_argument("id", type = int, help = "name is required and should be a int", required = True)
update_parser.add_argument("name", type = str, help = "name is required and should be a string", required = True)
update_parser.add_argument("genre", type = str, help = "genre is required and should be a string", required = True)
update_parser.add_argument("duration", type = str, help = "duration is required and should be a string", required = True)
update_parser.add_argument("lyrics", type = str, help = "lyrics is required and should be a string", required = True)
update_parser.add_argument("date_added", type = str, help = "date_added is required and should be a string", required = True) 
update_parser.add_argument("album_id", type=int)

class UpdateSong(Resource):
    @auth_required("token")
    @roles_required("creator")
    def put(self):
        args = update_parser.parse_args()
        song_id = args.get("id")
        song = Song.query.get(song_id)
        if not song:
            return {"message": "No Song Found"}
        song.name = args.get("name") 
        song.genre = args.get("genre")
        song.duration = args.get("duration") 
        song.lyrics = args.get("lyrics") 
        song.date_added = args.get("date_added")
        song.album_id = args.get("album_id")
        song.artist_id = current_user.id
        db.session.commit()
        return {"message": "Song updated"}

api.add_resource(UpdateSong, '/updateSong')

delete_song_parser = reqparse.RequestParser()
delete_song_parser.add_argument("songId", type=int)

#-----------------------delete song-----------------------

class DeleteSong(Resource):
    @auth_required("token")
    @roles_required("creator")
    def delete(self):
        args = delete_song_parser.parse_args()
        song_id = args.get("songId")
        print(song_id)
        song = Song.query.get(song_id)
        if not song:
            return {"message": "No Song Found"}
        
        if song.artist_id != current_user.id:
            return {"message": "You don't have permission to delete this song"}
        
        db.session.delete(song)
        db.session.commit()
        return {"message": "Song deleted"}

api.add_resource(DeleteSong, '/deleteSong')
 
#-------------------------update album---------------------

album_update_parser = reqparse.RequestParser()
album_update_parser.add_argument("id", type=str)
album_update_parser.add_argument("name", type=str)
album_update_parser.add_argument("release_date",type=str)

class UpdateAlbum(Resource):
    @auth_required("token")
    @roles_required("creator")
    def put(self):
        args = album_update_parser.parse_args()
        album_id = args.get("id")
        album = Album.query.get(album_id)
        if not album:
            return {"message": "No Album Found"}
        album.name = args.get("name")
        album.release_date = args.get("release_date")
        db.session.commit()
        return {"message": "Album Updated"}
api.add_resource(UpdateAlbum, '/updateAlbum')


#-------------------delete album--------------------

delete_album_parser = reqparse.RequestParser()
delete_album_parser.add_argument("albumId", type=int)

class DeleteAlbum(Resource):
    @auth_required("token")
    @roles_required("creator")
    def delete(self):
        args = delete_album_parser.parse_args()
        album_id = args.get("albumId")
        album = Album.query.get(album_id)
        if not album:
            return {"message": "No Album Found"}
        
        if album.artist_id != current_user.id:
            return {"message": "You don't have permission to delete this song"}
        
        db.session.delete(album)
        db.session.commit()
        return {"message": "album deleted"}

api.add_resource(DeleteAlbum, '/deleteAlbum')


#----------------------get and post for playlist----------------

playlist_parser = reqparse.RequestParser()
playlist_parser.add_argument("name", type = str, help = "name is required and should be a string", required = True)

playlist_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'user_id': fields.String,
}

class CreatePlaylist(Resource):
    @auth_required("token")
    def get(self):
        if "user" not in current_user.roles:
            playlists = Playlist.query.filter(
                Playlist.user_id == current_user.id).all()
        else:
            playlists = Playlist.query.filter_by(user_id=current_user.id).all()
        
        if playlists:
            return jsonify(marshal(playlists, playlist_fields))
        else:
            return {"message": " No Resource Found "}
        
    @auth_required("token")
    def post(self):
        args = playlist_parser.parse_args()
        playlist = Playlist(name=args.get("name"), 
                    user_id=current_user.id)
        db.session.add(playlist)
        db.session.commit()
        return {"message": "Playlist added"}
api.add_resource(CreatePlaylist, '/createPlaylist') 


#------------------------------get post and put for rating------------------

rating_parser = reqparse.RequestParser()
rating_parser.add_argument("song_id", type=int)
rating_parser.add_argument("rating", type=int)

class SongRating(Resource):
    @auth_required("token")
    def get(self):
        ratings = Rating.query.all()
        rating_data = []

        for rating in ratings:
            rating_dict = {
                "id": rating.id,
                "song_id": rating.song_id,  
                "rating": rating.rating 
            }
            rating_data.append(rating_dict)

        return jsonify(rating_data)
    @auth_required("token")
    def post(self):
        args = rating_parser.parse_args()
        rating = Rating(user_id=current_user.id,
                        song_id=args.get("song_id"),
                        rating=args.get("rating"))
        db.session.add(rating)
        db.session.commit()
        return {"message" : "rating sent"}
    @auth_required("token")
    def put(self):
        args = rating_parser.parse_args()
        print("this is args",args)
        song_id = args.get("song_id")
        new_rating = args.get("rating")
        user_id = current_user.id
        rating = Rating.query.filter_by(user_id=user_id,song_id=song_id).first()
        total_rating = rating.rating
        if not rating:
            return {"message": "Rating not found for the given song"}, 404
        
        rating.rating = total_rating + new_rating

        db.session.commit()

        return {"message": "Rating updated successfully"}
api.add_resource(SongRating, '/song_rating')
