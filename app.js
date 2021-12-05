const textArea = document.querySelector('textarea');
const voiceListBlock = document.querySelector('select');
const speechBtn = document.querySelector('.btn');

const synth = speechSynthesis;
let isSpeaking = true;

// Render list voice 
const renderListVoices = () => {
    // Get voice 
    const listVoices = synth.getVoices();
    const optionTags = listVoices.map((voice) => {
        // Set Google US English default
        let selected = voice.name === "Google US English" ? "selected" : "";
        return `
            <option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>
        `
    })
    voiceListBlock.innerHTML = optionTags.join('');
}

renderListVoices();

synth.addEventListener("voiceschanged", renderListVoices);

const textToSpeech = text => {
    let utterance = new SpeechSynthesisUtterance(text);
    for (let voice of synth.getVoices()) {
        if (voice.name === voiceListBlock.value) {
            utterance.voice = voice;
        }
    }
    synth.speak(utterance); // Speak the speech/ utterance
}

speechBtn.addEventListener('click', e => {
    e.preventDefault();
    if (textArea.value) {
        if (!synth.speaking) {
            textToSpeech(textArea.value);
        }
        if (textArea.value.length > 80) {
            if (isSpeaking) {
                synth.resume();
                isSpeaking = false;
                speechBtn.innerText = "Pause Speech";
            } else {
                synth.pause();
                isSpeaking = true;
                speechBtn.innerText = "Resume Speech";
            }

            setInterval(() => {
                if (!synth.speaking && !isSpeaking) {
                    isSpeaking = true;
                    speechBtn.innerText = "Convert To Speech";
                }
            })
        }
    }
})
