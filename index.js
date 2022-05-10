console.clear();

document.addEventListener("DOMContentLoaded", function(event) {
//Create Freq Varible
var freq = 440;
var start = 0;  
var currentOct = 4;
var envTime = 0.06;

//create the context for the web audio
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

    //Create gain Nodes
    let gainList = [
        audioCtx.createGain(),
        audioCtx.createGain(),
        audioCtx.createGain(),
        audioCtx.createGain(),
        audioCtx.createGain(),
        audioCtx.createGain(),
        audioCtx.createGain(),
        audioCtx.createGain(),
        audioCtx.createGain()
    ]; 

    //Create Master Gain / Gain for Env
    let masterGain = audioCtx.createGain();
    masterGain.gain.value = 0;

    //Gain Sliders linking
    let volumeList = [
        document.querySelector('#sixteen'),
        document.querySelector('#five_thirteen'),
        document.querySelector('#eight'),
        document.querySelector('#four'),
        document.querySelector('#two_two_three'),
        document.querySelector('#two'),
        document.querySelector('#one_three_five'),
        document.querySelector('#one_third'),
        document.querySelector('#one')
    ];

    //Create Keys to Be watched and Configed
    let keyboardList = [
        document.querySelector('#CB'),
        document.querySelector('#CSharp'),
        document.querySelector('#DB'),
        document.querySelector('#DSharp'),
        document.querySelector('#EB'),
        document.querySelector('#FB'),
        document.querySelector('#FSharp'),
        document.querySelector('#GB'),
        document.querySelector('#GSharp'),
        document.querySelector('#AB'),
        document.querySelector('#ASharp'),
        document.querySelector('#BB'),
        document.querySelector('#CBt')
    ];

    let octList = [
        document.querySelector('#BUP'),
        document.querySelector('#BDN')
    ]


    //Function to be called repeatedly 
    function initGain(num){
        gainList[num].gain.value = start;
        volumeList[num].addEventListener('input', function() {
            gainList[num].gain.value = this.value;
        }, false);
    }

    //Init each of the gain Knobs
    for(var i = 0; i < 9; i++){
        initGain(i);
    }

    //Osc List
    let oscList = [
        audioCtx.createOscillator(),
        audioCtx.createOscillator(),
        audioCtx.createOscillator(),
        audioCtx.createOscillator(),
        audioCtx.createOscillator(),
        audioCtx.createOscillator(),
        audioCtx.createOscillator(),
        audioCtx.createOscillator(),
        audioCtx.createOscillator()
    ];

    //Let Tremolo Work
    var tremoloOsc = audioCtx.createOscillator();
    var tremoloGain = audioCtx.createGain();
    var tremOscGain = audioCtx.createGain();
    tremoloOsc.frequency.value = 5;
    tremOscGain.gain.value = 0.3;
    tremoloOsc.connect(tremOscGain);

    let octaveList = [
        document.querySelector('#octup'),
        document.querySelector('#octdn')
    ];

   octaveList[0].addEventListener("mousedown", octaveUp, false);
   octaveList[1].addEventListener("mousedown", octaveDn, false);

    let oscFreqList = [0.5, 1, 1.498823530, 2, 2.997647060, 4, 5.040941178, 5.995294120, 8];
    let keyFreqList = [
        32.70, 
        34.65, 
        36.71, 
        38.89, 
        41.20, 
        43.65, 
        46.25, 
        49.00,
        51.91,
        55.00,
        58.27,
        61.74,
        65.41
    ];

    //Wavetable Osc

    //Function to set Osc Freqs
    function setFreq(_freqs){
        for(var i = 0; i < 9; i++){
            oscList[i].frequency.setTargetAtTime(_freqs * oscFreqList[i], audioCtx.currentTime, 0.015);
        }
    }


    //Set the Frequency of Each Oscilator 
    setFreq(440);
    
    for (var i = 0; i < 13; i++){
        keyboardList[i].dataset["frequency"] = keyFreqList[i];
        keyboardList[i].addEventListener("mousedown", notePressed, false);
        keyboardList[i].addEventListener("mouseup", noteReleased, false);
    }

    var convolver = audioCtx.createConvolver();

    //Create Graph
    for (var i = 0; i < 9; i++){
        oscList[i].type = "sine";
        oscList[i].start();
        oscList[i].connect(gainList[i]).connect(masterGain);
    }

    //Set all to Master Gain
    tremoloOsc.connect(tremoloGain.gain);
    masterGain.connect(tremoloGain);
    tremoloOsc.start();
    tremoloGain.connect(audioCtx.destination);


    //Octave Switch
    function octaveUp(event){
        if (event.buttons & 1){
            currentOct = currentOct * 2;
            setFreq(freq * currentOct);
        }
    }

    //Octave Down Switch
    function octaveDn(event){
        if (event.buttons & 1){
            currentOct = currentOct / 2;
            setFreq(freq * currentOct);
        }
    }

    //If the Button is Pressed Then Change the Note
    function notePressed(event){
        if (event.buttons & 1){
            let dataset = event.target.dataset;

            if (!dataset["pressed"]){
                setFreq(dataset["frequency"] * currentOct);
                freq = dataset["frequency"];
                masterGain.gain.setTargetAtTime(1, audioCtx.currentTime, envTime);
                dataset["pressed"] = "yes";
                console.log(audioCtx.currentTime);
            }
        }
    }

    //if the Button is Released then Stop Playing the Note
    function noteReleased(event){
        let dataset = event.target.dataset;
        masterGain.gain.setTargetAtTime(0, audioCtx.currentTime, envTime);
        delete dataset["pressed"];
    }

});


