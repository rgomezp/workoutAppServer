var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var {User, Routine, Exercise, ExerciseOptions} = require('../models/models');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Workout Server' });
});

/* GET routine send it to the app */
router.get('/routine/:userId', function(req, res){
  // Fetch user's most recent routine
  Routine.find({}).sort({date: -1}).exec(function(err, routine) {
    Exercise.find({routine :routine}, function(err, exercises){
      res.send(exercises);
    });
  });
});


/* POST create user
    This route will create a user, create a routine based on inputted preference, and create the exercises to complete
 */
router.get('/createUser/:name', function(req, res, next) {
  // create user ---------------------------------
  var newUser = new User({
    name: req.params.name
  });

  var userSavePromise = newUser.save();

  userSavePromise.then(function(user) {
    // create routine and assign to user ---------
    var newDate = new Date();
    var newRoutine = new Routine({owner: user._id, goal: "bulk", date: newDate});

    var routineSavePromise = newRoutine.save();

    routineSavePromise.then(function(routine) {
      // create user exercises ------------------
      ExerciseOptions.find({
        day: 1
      }, function(err, options) {
        return options;
      }).then((exerciseOptions) => {
        exerciseOptions.forEach((doc) => {
          var newExercise = new Exercise({
            routine: routine._id,
            title: doc.title,
            sets: doc.sets,
            reps: doc.reps,
            weight: doc.weight,
            difficulty: "",
            notes: doc.notes,
            completed: 0
          });
          newExercise.save();
        });
        res.send('done!');
      })
    })
  }).catch((err)=>{res.status(500).send(err.message)})
});

module.exports = router;
