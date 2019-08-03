var config = {
    apiKey: "AIzaSyDH6-1VkOI14HRUCBfLtbRLTWB4FGjMlJw",
    authDomain: "clickbutton-activity.firebaseapp.com",
    databaseURL: "https://clickbutton-activity.firebaseio.com",
    projectId: "clickbutton-activity",
    storageBucket: "",
    messagingSenderId: "497936970980",
    appId: "1:497936970980:web:f8203df12922504e"
};

firebase.initializeApp(config);

var database = firebase.database();


function currentTime() {
    var time = moment().format("hh:mm a")
    $("#time").html(time)
}


$(document).ready(function () {

    currentTime()
    setInterval(currentTime, 60000)

    // drop down to select time
    $("#traintime").timepicker({
        timeFormat: "h:i a ",
        step: 10,
        // defaultTime: "",
        // startTime: '10:00',
        dynamic: true,
        dropdown: true,
        scrollbar: true
    });

    
    //test command for form validation - beta version
    $("#test").on("click", function () {
        event.preventDefault()
        alert("test")
        var trainName = $("#name").val();
        console.log(("Train name: " + trainName))
        var trainFirstTime = $("#traintime").val();
        var unixtrainFirstTime = moment(trainFirstTime, "hh:mm a").format("X")
        console.log("without moment.js: " + trainFirstTime);
        console.log("unix time: " + unixtrainFirstTime)
        console.log("start time hh:mm: " + moment(unixtrainFirstTime, "X").format("hh:mm a"));
        console.log("start time hh:mm: " + moment(unixtrainFirstTime, "X").format("HH:mm"));
        
        // $(".needs-validation").addClass("was-validated")
        
        
        (function () {
            // 'use strict';
            window.addEventListener('load', function () {
                // Fetch all the forms we want to apply custom Bootstrap validation styles to
                var forms = document.getElementsByClassName('needs-validation');
                // Loop over them and prevent submission
                var validation = Array.prototype.filter.call(forms, function (form) {
                    form.addEventListener('submit', function (event) {
                        if (form.checkValidity() === false) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                        form.classList.add('was-validated');
                    }, false);
                });
            }, false);
           
        })();

    })

    $("#add-train-btn").on("click", function () {
        alert("test");
        event.preventDefault();

        // Grabs user input and store in database
        var trainName = $("#name").val().trim();
        var trainDestination = $("#destination").val().trim();
        var trainFirstTime = $("#traintime").val();
        var trainFrequency = $("#frequency").val().trim();

        // covert time to unix time an store
        // var unixtrainFirstTime = moment(trainFirstTime, "hh:mm a").format("X")

        // Creates local "temporary" object for holding employee data
        var newTrain = {
            name: trainName,
            destination: trainDestination,
            time: trainFirstTime,
            frequency: trainFrequency
        };

        // Uploads employee data to the database
        database.ref().push(newTrain);

        // Logs everything to console
        console.log("Train name: " + newTrain.name);
        console.log("Destination: " + newTrain.destination);
        console.log("First train Time: " + newTrain.time);
        console.log("Frequency: " + newTrain.frequency);

        alert("train successfully added");

        // Clears all of the text-boxes
        $("#name").val("");
        $("#destination").val("");
        $("#traintime").val("");
        $("#frequency").val("");

    });

    // 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
    database.ref().on("child_added", function (childSnapshot) {
        console.log(childSnapshot.val());

        // Store everything into a local variable coming from database
        var trainName = childSnapshot.val().name;
        var trainDestination = childSnapshot.val().destination;
        var trainFirstTime = childSnapshot.val().time;
        var trainFrequency = childSnapshot.val().frequency;

        console.log(trainFrequency);

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(trainFirstTime, "hh:mm a").subtract(1, "years");
        console.log(firstTimeConverted);

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + currentTime.format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % trainFrequency;
        console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = trainFrequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm a"));

        // Create the new row
        var newRow = $("<tr>").addClass("traindata").append(
            $("<td>").html(trainName),
            $("<td>").html(trainDestination),
            $("<td>").html(trainFrequency),
            $("<td>").html(moment(nextTrain).format("hh:mm a")),
            $("<td>").html(tMinutesTillTrain)

        );

        // Append the new row to the table
        $("#train-table").append(newRow);
    });

    // update the minutes to arrival every minute
    setInterval(() => {

        $(".traindata").empty();
        database.ref().once("value", function (snapshot) {
            snapshot.forEach(function (childSnapshot) {

                var trainName = childSnapshot.val().name;
                var trainDestination = childSnapshot.val().destination;
                var trainFirstTime = childSnapshot.val().time;
                var trainFrequency = childSnapshot.val().frequency;

                // First Time (pushed back 1 year to make sure it comes before current time)
                var firstTimeConverted = moment(trainFirstTime, "hh:mm a").subtract(1, "years");
                console.log(firstTimeConverted);

                // Current Time
                var currentTime = moment();
                console.log("CURRENT TIME: " + currentTime.format("hh:mm"));

                // Difference between the times
                var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
                console.log("DIFFERENCE IN TIME: " + diffTime);

                // Time apart (remainder)
                var tRemainder = diffTime % trainFrequency;
                console.log(tRemainder);

                // Minute Until Train
                var tMinutesTillTrain = trainFrequency - tRemainder;
                console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

                // Next Train
                var nextTrain = moment().add(tMinutesTillTrain, "minutes");
                console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm a"));

                // Create the new row
                var newRow = $("<tr>").addClass("traindata").append(
                    $("<td>").html(trainName),
                    $("<td>").html(trainDestination),
                    $("<td>").html(trainFrequency),
                    $("<td>").html(moment(nextTrain).format("hh:mm a")),
                    $("<td>").html(tMinutesTillTrain)
                );
                // Append the new row to the table
                $("#train-table").append(newRow);

            })
        })

    }, 60000);


})

