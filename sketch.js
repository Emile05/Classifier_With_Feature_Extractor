// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Image Classification using Feature Extractor with MobileNet
=== */

// Grab all the DOM elements
let video = document.getElementById('video');
let videoStatus = document.getElementById('videoStatus');
let loading = document.getElementById('loading');
let catButton = document.getElementById('aButton');
let dogButton = document.getElementById('bButton');
let amountOfCatImages = document.getElementById('amountOfAImages');
let amountOfDogImages = document.getElementById('amountOfBImages');
let train = document.getElementById('train');
let loss = document.getElementById('loss');
let result = document.getElementById('result');
var predict = document.getElementById('predict');

// A variable to store the total loss
let totalLoss = 0;

// Create a webcam capture
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        video.src = window.URL.createObjectURL(stream);
        video.play();
    });
}

// A function to be called when the model has been loaded
function modelLoaded() {
    loading.innerText = 'Model loaded!';
}

// Extract the already learned features from MobileNet
const featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded);
// Create a new classifier using those features
const classifier = featureExtractor.classification(video, videoReady);

// Predict the current frame.
function predict() {
    classifier.predict(gotResults);
}

// A function to be called when the video is finished loading
function videoReady() {
    videoStatus.innerText = 'Video ready!';
}

// When the Cat button is pressed, add the current frame
// from the video with a label of cat to the classifier
catButton.onclick = function () {
    classifier.addImage('A');
    amountOfCatImages.innerText = Number(amountOfCatImages.innerText) + 1;
};

// When the Cat button is pressed, add the current frame
// from the video with a label of cat to the classifier
dogButton.onclick = function () {
    classifier.addImage('B');
    amountOfDogImages.innerText = Number(amountOfDogImages.innerText) + 1;
};

// When the train button is pressed, train the classifier
// With all the given cat and dog images
train.onclick = function () {
    classifier.train(function(lossValue) {
        if (lossValue) {
            totalLoss = lossValue;
            loss.innerHTML = 'Loss: ' + totalLoss;
        } else {
            loss.innerHTML = 'Done Training! Final Loss: ' + totalLoss;
        }
    });
};

// Show the results
function gotResults(err, data) {
    // Display any error
    if (err) {
        console.error(err);
    }
    result.innerText = data;
    classifier.classify(gotResults);
}

// Start predicting when the predict button is clicked
predict.onclick = function () {
    classifier.classify(gotResults);
};
