<template>
    <div class="h-screen w-1/3">
        <div class="min-h-screen max-h-screen flex flex-col bg-gray-100 p-8">
            <h1 class="mb-6 text-3xl font-bold">Audio Filter Test</h1>
            <div class="overflow-y-auto">
                <div class="space-y-6">
                    <div v-for="(effect, index) in effects" :key="index" class="rounded-lg bg-white p-4 shadow">
                        <div class="mb-2 flex items-center justify-between">
                            <h2 class="text-xl font-semibold">{{ effect.type }} Effect</h2>
                            <button @click="removeEffect(index)" class="text-red-500 hover:text-red-700">Remove</button>
                        </div>
                        <div class="space-y-2">
                            <div v-for="(value, key) in effect" :key="key" class="flex items-center">
                            <template v-if="String(key) !== 'type'">
                            <label :for="`${effect.type}-${key}`" class="w-1/4">{{ key }}:</label>
                            <input
                                :id="`${effect.type}-${key}`"
                                v-model.number="effect[key]"
                                type="range"
                                :min="getMin(String(key))"
                                :max="getMax(String(key))"
                                :step="getStep(String(key))"
                                class="w-1/2"
                                @input="updateFilter"
                            />
                            <input
                                v-model.number="effect[key]"
                                type="number"
                                :min="getMin(String(key))"
                                :max="getMax(String(key))"
                                :step="getStep(String(key))"
                                class="ml-2 w-1/4 rounded border px-2 py-1"
                                @input="updateFilter"
                            />
                            </template>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-4 flex space-x-4">
                <select v-model="selectedEffect" class="rounded border p-2">
                    <option v-for="type in effectTypes" :key="type" :value="type">
                        {{ type }}
                    </option>
                </select>
                <button @click="addEffect" class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                    Add Effect
                </button>
                <button @click="exportFilter" class="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600">
                    Export Filter
                </button>
                <button @click="close" class="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600">Close</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useEvents } from '@Composables/useEvents';

const webview = useEvents();

const effects = ref([]);

const effectTypes = [
    'rotate',
    'volume',
    'peakeq',
    'damp',
    'autowah',
    'phaser',
    'chorus',
    'distortion',
    'compressor2',
    'bqf',
    'echo4',
    'pitchshift',
    'freeverb',
];

const selectedEffect = ref(effectTypes[0]);

const getMin = (key: string) => {
    switch (key) {
        case 'fVolume':
        case 'fDryMix':
        case 'fWetMix':
        case 'fQuiet':
        case 'fGain':
        case 'fQ':
        case 'fS':
            return 0;
        case 'fPitchShift':
        case 'fSemitones':
            return -12;
        case 'priority':
        case 'channel':
        case 'lBand':
        case 'lFilter':
        case 'lFFTsize':
        case 'lOsamp':
        case 'lMode':
            return 0;
        default:
            return -1000;
    }
};

const getMax = (key: string) => {
    switch (key) {
        case 'fVolume':
        case 'fDryMix':
        case 'fWetMix':
        case 'fQuiet':
        case 'fGain':
        case 'fQ':
        case 'fS':
            return 1;
        case 'fPitchShift':
        case 'fSemitones':
            return 12;
        case 'priority':
            return 100;
        case 'channel':
            return 1;
        case 'lBand':
        case 'lFilter':
            return 10;
        case 'lFFTsize':
            return 8192;
        case 'lOsamp':
            return 32;
        case 'lMode':
            return 2;
        default:
            return 1000;
    }
};

const getStep = (key: string) => {
    switch (key) {
        case 'fVolume':
        case 'fDryMix':
        case 'fWetMix':
        case 'fQuiet':
        case 'fGain':
            return 0.01;
        case 'fPitchShift':
        case 'fSemitones':
            return 0.1;
        case 'priority':
        case 'channel':
        case 'lBand':
        case 'lFilter':
        case 'lFFTsize':
        case 'lOsamp':
        case 'lMode':
        case 'fQ':
        case 'fS':
            return 1;
        default:
            return 0.1;
    }
};

const updateFilter = () => {
    webview.emitClient('updateAudioFilter', effects.value);
};

const addEffect = () => {
    let newEffect: any = { type: selectedEffect.value, priority: 0 };

    switch (selectedEffect.value) {
        case 'rotate':
            newEffect.fRate = 0;
            break;
        case 'volume':
            newEffect.fVolume = 1;
            newEffect.channel = 0;
            break;
        case 'peakeq':
            newEffect.lBand = 0;
            newEffect.fBandwidth = 1;
            newEffect.fQ = 1;
            newEffect.fCenter = 0;
            newEffect.fGain = 0;
            break;
        case 'damp':
            newEffect.fTarget = 0;
            newEffect.fQuiet = 0;
            newEffect.fRate = 0;
            newEffect.fGain = 0;
            newEffect.fDelay = 0;
            break;
        case 'autowah':
        case 'phaser':
            newEffect.fDryMix = 0.5;
            newEffect.fWetMix = 0.5;
            newEffect.fFeedback = 0;
            newEffect.fRate = 0;
            newEffect.fRange = 0;
            newEffect.fFreq = 0;
            break;
        case 'chorus':
            newEffect.fDryMix = 0.5;
            newEffect.fWetMix = 0.5;
            newEffect.fFeedback = 0;
            newEffect.fMinSweep = 0;
            newEffect.fMaxSweep = 0;
            newEffect.fRate = 0;
            break;
        case 'distortion':
            newEffect.fDrive = 0;
            newEffect.fDryMix = 0.5;
            newEffect.fWetMix = 0.5;
            newEffect.fFeedback = 0;
            newEffect.fVolume = 1;
            break;
        case 'compressor2':
            newEffect.fGain = 0;
            newEffect.fThreshold = 0;
            newEffect.fRatio = 1;
            newEffect.fAttack = 0;
            newEffect.fRelease = 0;
            break;
        case 'bqf':
            newEffect.lFilter = 0;
            newEffect.fCenter = 0;
            newEffect.fGain = 0;
            newEffect.fBandwidth = 1;
            newEffect.fQ = 1;
            newEffect.fS = 1;
            break;
        case 'echo4':
            newEffect.fDryMix = 0.5;
            newEffect.fWetMix = 0.5;
            newEffect.fFeedback = 0;
            newEffect.fDelay = 0;
            break;
        case 'pitchshift':
            newEffect.fPitchShift = 0;
            newEffect.fSemitones = 0;
            newEffect.lFFTsize = 1024;
            newEffect.lOsamp = 4;
            break;
        case 'freeverb':
            newEffect.fDryMix = 0.5;
            newEffect.fWetMix = 0.5;
            newEffect.fRoomSize = 0.5;
            newEffect.fDamp = 0.5;
            newEffect.fWidth = 1;
            newEffect.lMode = 0;
            break;
    }

    effects.value.push(newEffect);
    updateFilter();
};

const exportFilter = () => {
  const filterName = 'myCustomFilter'; // You can make this dynamic if needed
  let exportCode = `const ${filterName} = new alt.AudioFilter('${filterName}');\n`;

  effects.value.forEach((effect, index) => {
    switch (effect.type) {
      case 'bqf':
        exportCode += `${filterName}.addBqfEffect(${effect.lFilter}, ${effect.fCenter}, ${effect.fGain}, ${effect.fBandwidth}, ${effect.fQ}, ${effect.fS}, ${effect.priority});\n`;
        break;
      case 'distortion':
        exportCode += `${filterName}.addDistortionEffect(${effect.fDrive}, ${effect.fDryMix}, ${effect.fWetMix}, ${effect.fFeedback}, ${effect.fVolume}, ${effect.priority});\n`;
        break;
      case 'volume':
        exportCode += `${filterName}.addVolumeEffect(${effect.fVolume}, ${effect.priority});\n`;
        break;
      case 'peakeq':
        exportCode += `${filterName}.addPeakeqEffect(${effect.lBand}, ${effect.fBandwidth}, ${effect.fQ}, ${effect.fCenter}, ${effect.fGain}, ${effect.priority});\n`;
        break;
      case 'rotate':
        exportCode += `${filterName}.addRotateEffect(${effect.fRate}, ${effect.priority});\n`;
        break;
      case 'damp':
        exportCode += `${filterName}.addDampEffect(${effect.fTarget}, ${effect.fQuiet}, ${effect.fRate}, ${effect.fGain}, ${effect.fDelay}, ${effect.priority});\n`;
        break;
      case 'autowah':
        exportCode += `${filterName}.addAutowahEffect(${effect.fDryMix}, ${effect.fWetMix}, ${effect.fFeedback}, ${effect.fRate}, ${effect.fRange}, ${effect.fFreq}, ${effect.priority});\n`;
        break;
      case 'phaser':
        exportCode += `${filterName}.addPhaserEffect(${effect.fDryMix}, ${effect.fWetMix}, ${effect.fFeedback}, ${effect.fRate}, ${effect.fRange}, ${effect.fFreq}, ${effect.priority});\n`;
        break;
      case 'chorus':
        exportCode += `${filterName}.addChorusEffect(${effect.fDryMix}, ${effect.fWetMix}, ${effect.fFeedback}, ${effect.fMinSweep}, ${effect.fMaxSweep}, ${effect.fRate}, ${effect.priority});\n`;
        break;
      case 'compressor2':
        exportCode += `${filterName}.addCompressor2Effect(${effect.fGain}, ${effect.fThreshold}, ${effect.fRatio}, ${effect.fAttack}, ${effect.fRelease}, ${effect.priority});\n`;
        break;
      case 'echo4':
        exportCode += `${filterName}.addEcho4Effect(${effect.fDryMix}, ${effect.fWetMix}, ${effect.fFeedback}, ${effect.fDelay}, ${effect.priority});\n`;
        break;
      case 'pitchshift':
        exportCode += `${filterName}.addPitchShiftEffect(${effect.fPitchShift}, ${effect.fSemitones}, ${effect.lFFTsize}, ${effect.lOsamp}, ${effect.priority});\n`;
        break;
      case 'freeverb':
        exportCode += `${filterName}.addFreeverbEffect(${effect.fDryMix}, ${effect.fWetMix}, ${effect.fRoomSize}, ${effect.fDamp}, ${effect.fWidth}, ${effect.lMode}, ${effect.priority});\n`;
        break;
      default:
        console.warn(`Export not implemented for effect type: ${effect.type}`);
    }
  });

  console.log(exportCode);
};

const removeEffect = (index: number) => {
    effects.value.splice(index, 1);
    updateFilter();
};

const close = () => {
    webview.emitClient('closeAudioFilterTest');
};

onMounted(() => {
    updateFilter();
});
</script>
