//Initialize Firebase
var config = {
    apiKey: "AIzaSyBS1PDaYB_qWBdhHKvL3esT08ZmtpgIccE",
    authDomain: "traintime-95a87.firebaseapp.com",
    databaseURL: "https://traintime-95a87.firebaseio.com",
    projectId: "traintime-95a87",
    storageBucket: "",
    messagingSenderId: "769341796507"
};
firebase.initializeApp(config);

var database = firebase.database();

// Button for adding trains
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = $("#first-train-input").val();
    var frequency = $("#frequency-input").val().trim();

    //Creates local "temporary" object for holding data
    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
    };

    // Uploads train data to the database
    database.ref().push(newTrain);

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");

});

database.ref().on("child_added", function(childSnapshot, prevChildKey) {

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var firstTrain = childSnapshot.val().firstTrain;
    var frequency = childSnapshot.val().frequency;

    var firstTrainConverted = moment(firstTrain, "hh:mm").subtract(1, "years");

    // Current Time
    var currentTime = moment();

    // Difference between the times
    var diffTime = moment().diff(moment(firstTrainConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;

    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");

    //appends info to page
    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
        frequency + "</td><td>" + moment(nextTrain).format("hh:mm") + "</td><td>" + tMinutesTillTrain + "</td></tr>"
    );
});