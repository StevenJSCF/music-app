const tf = require("@tensorflow/tfjs-node");
const fs = require("fs");

// Load dataset from JSON file
const raw = fs.readFileSync("current-chord-dataset.json");
const dataset = JSON.parse(raw);

// Map chord labels → numbers
const labelMap = {
  G: 0,
  C: 1,
  D: 2,
  Em: 3,
};

// Convert dataset to tensors
const xs = [];
const ys = [];

for (const sample of dataset) {
  xs.push(sample.landmarks);               // 63 input features
  ys.push(labelMap[sample.label]);         // numeric label
}

// Convert to TensorFlow.js tensors
const xsTensor = tf.tensor2d(xs);          // shape: [numSamples, 63]
const ysTensor = tf.oneHot(tf.tensor1d(ys, "int32"), 4); // shape: [numSamples, 4]

// Build the neural network model
const model = tf.sequential();
model.add(tf.layers.dense({ units: 128, activation: "relu", inputShape: [63] }));
model.add(tf.layers.dense({ units: 64, activation: "relu" }));
model.add(tf.layers.dense({ units: 4, activation: "softmax" })); // 4 chords

model.compile({
  optimizer: tf.train.adam(0.001),
  loss: "categoricalCrossentropy",
  metrics: ["accuracy"],
});

async function train() {
  console.log("Training model...");

  const history = await model.fit(xsTensor, ysTensor, {
    epochs: 50,
    batchSize: 16,
    shuffle: true,
    validationSplit: 0.2,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(
          `Epoch ${epoch + 1} — Loss: ${logs.loss.toFixed(
            3
          )}, Accuracy: ${logs.acc.toFixed(3)}`
        );
      },
    },
  });

  console.log("Training finished!");

  // Save model to folder "model/"
  await model.save("file://model");
  console.log("Model saved to ./model/");
}

train();
