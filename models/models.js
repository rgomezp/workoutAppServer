var mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true }).then(()=>{
  console.log("Connected!")
}, err=>{console.log("Error, could not connect!")});

var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: {
    type     : String,
    // unique   : true,
    required : false
  },
  name: {
    type  : String,
    unique: true,
    required: true
  },
  age: Number
});
var exerciseTemplateSchema = new Schema({
  title : String,
  sets  : Number,
  reps  : Number,
  weight: Number,
  notes : String,
  day   : Number
});

var routineSchema = new Schema({
  owner : {
    type: mongoose.Schema.Types.ObjectId,
    ref : 'User'
  },
  goal  : String,
  date  : Date
});

// represents a single workout
var exerciseSchema = new Schema({
  routine     : {
    type  : mongoose.Schema.Types.ObjectId,
    ref   : 'Routine'
  },
  title       : String,
  sets        : Number,
  reps        : Number,
  weight      : Number,
  difficulty  : Number,
  notes       : String,
  completed   : Number
})

module.exports = {
  User    : mongoose.model('User', userSchema),
  Routine : mongoose.model('Routine', routineSchema),
  ExerciseOptions : mongoose.model('WorkoutOptions', exerciseTemplateSchema),
  Exercise : mongoose.model('Exercise', exerciseSchema)
};
