const {gql} = require('apollo-server-express');
const Movie = require('./models/movie').Movies;
const typeDefs = gql`
type Movie {
    _id: ID!
    name: String!
    producer: String!
    rating: Float!
}
type Query {
    getMovies: [Movie]
    getMovie(id: ID!): Movie
}
type Mutation {
    addMovie(name: String!, producer: String!, rating: Float!): Movie
    updateMovie(name: String!, producer: String!, rating: Float): Movie
    deleteMovie(id: ID!): Movie
}
`
const resolvers = {
    Query: {
        getMovies: async (parent, args) =>{
            const mov =  await Movie.find({}).exec();
            console.log("record: ", mov);
            return mov;
        },
        getMovie: async (parent, args) => {
            return  await Movie.findById({_id: args.id});
        }
    },
    Mutation: {
        addMovie: (parent, args) => {
            console.log("movies: ",args);
            let movies = new Movie({
                name: args.name,
                producer: args.producer,
                rating: args.rating,
            });
            return movies.save();
        },
        updateMovie: (parent, args) =>{
            if(!args.id) return;
            return Movie.findOneAndUpdate(
                {
                   _id: args.id
                },
                {
                    $set: {
                        name: args.name,
                        producer: args.producer,
                        rating: args.rating,
                    }
                },
                {new: true},
                (err, Movie) =>{
                    if(err){
                        console.log('Something went wrong when updating the movie');
                    }
                    else{

                    }
                }
            );
        }
    }
}

module.exports = {
    typeDefs, resolvers
}