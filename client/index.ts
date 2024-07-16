import alt from 'alt-client';
import { useWebview } from '@Client/webview/index.js';

const webview = useWebview();
let testAudio: alt.Audio | null = null;
let audioFilter: alt.AudioFilter | null = null;
let audioOuput: alt.AudioOutput | null = null;
let lastEffects: string = '';

alt.onServer('startAudioFilterTest', (audioSource: string) => {
    testAudio = new alt.Audio(audioSource, 1);
    audioFilter = new alt.AudioFilter('TestFilter');
    audioOuput = new alt.AudioOutputFrontend(alt.hash('video_editor_weapons_guns_bullet_impacts'));
    testAudio.addOutput(audioOuput);
    testAudio.play();

    alt.toggleGameControls(false);
    webview.show('AudioFilterEditor', 'page');
    webview.focus();
    webview.showCursor(true);
});

webview.on('updateAudioFilter', (effects: any[]) => {
    if (!audioFilter || !testAudio) return;

    const currentEffects = JSON.stringify(effects);
    if (currentEffects === lastEffects) return;
    lastEffects = currentEffects;

    audioFilter.destroy();
    audioFilter = new alt.AudioFilter('TestFilter');

    alt.logWarning('Adding effects:', effects);
    Object.values(effects).forEach((effect) => {
        switch (effect.type) {
            case 'rotate':
                audioFilter.addRotateEffect(effect.fRate, effect.priority);
                break;
            case 'volume':
                audioFilter.addVolumeEffect(effect.fVolume, effect.priority, effect.channel);
                break;
            case 'peakeq':
                audioFilter.addPeakeqEffect(
                    effect.lBand,
                    effect.fBandwidth,
                    effect.fQ,
                    effect.fCenter,
                    effect.fGain,
                    effect.priority,
                );
                break;
            case 'damp':
                audioFilter.addDampEffect(
                    effect.fTarget,
                    effect.fQuiet,
                    effect.fRate,
                    effect.fGain,
                    effect.fDelay,
                    effect.priority,
                );
                break;
            case 'autowah':
                audioFilter.addAutowahEffect(
                    effect.fDryMix,
                    effect.fWetMix,
                    effect.fFeedback,
                    effect.fRate,
                    effect.fRange,
                    effect.fFreq,
                    effect.priority,
                );
                break;
            case 'phaser':
                audioFilter.addPhaserEffect(
                    effect.fDryMix,
                    effect.fWetMix,
                    effect.fFeedback,
                    effect.fRate,
                    effect.fRange,
                    effect.fFreq,
                    effect.priority,
                );
                break;
            case 'chorus':
                audioFilter.addChorusEffect(
                    effect.fDryMix,
                    effect.fWetMix,
                    effect.fFeedback,
                    effect.fMinSweep,
                    effect.fMaxSweep,
                    effect.fRate,
                    effect.priority,
                );
                break;
            case 'distortion':
                audioFilter.addDistortionEffect(
                    effect.fDrive,
                    effect.fDryMix,
                    effect.fWetMix,
                    effect.fFeedback,
                    effect.fVolume,
                    effect.priority,
                );
                break;
            case 'compressor2':
                audioFilter.addCompressor2Effect(
                    effect.fGain,
                    effect.fThreshold,
                    effect.fRatio,
                    effect.fAttack,
                    effect.fRelease,
                    effect.priority,
                );
                break;
            case 'bqf':
                audioFilter.addBqfEffect(
                    effect.lFilter,
                    effect.fCenter,
                    effect.fGain,
                    effect.fBandwidth,
                    effect.fQ,
                    effect.fS,
                    effect.priority,
                );
                break;
            case 'echo4':
                audioFilter.addEcho4Effect(
                    effect.fDryMix,
                    effect.fWetMix,
                    effect.fFeedback,
                    effect.fDelay,
                    effect.priority,
                );
                break;
            case 'pitchshift':
                audioFilter.addPitchshiftEffect(
                    effect.fPitchShift,
                    effect.fSemitones,
                    effect.lFFTsize,
                    effect.lOsamp,
                    effect.priority,
                );
                break;
            case 'freeverb':
                audioFilter.addFreeverbEffect(
                    effect.fDryMix,
                    effect.fWetMix,
                    effect.fRoomSize,
                    effect.fDamp,
                    effect.fWidth,
                    effect.lMode,
                    effect.priority,
                );
                break;
        }
    });

    audioOuput.filter = audioFilter;
});

webview.on('closeAudioFilterTest', () => {
    alt.toggleGameControls(true);
    webview.hide('AudioFilterEditor');
    webview.unfocus();
    webview.showCursor(false);

    if (testAudio) {
        testAudio.destroy();
        testAudio = null;
    }
    if (audioFilter) {
        audioFilter.destroy();
        audioFilter = null;
    }
    if (audioOuput) {
        audioOuput = null;
    }
});

const radio = alt.AudioCategory.getForName('radio');
const category = alt.AudioCategory.getForName('video_editor_weapons_guns_bullet_impacts');
category.volume = 50;
category.distanceRolloffScale = radio.distanceRolloffScale;
category.plateauRolloffScale = radio.plateauRolloffScale;
category.occlusionDamping = radio.occlusionDamping;
category.environmentalFilterDamping = radio.environmentalFilterDamping;
category.sourceReverbDamping = radio.sourceReverbDamping;
category.distanceReverbDamping = radio.distanceReverbDamping;
category.interiorReverbDamping = radio.interiorReverbDamping;
category.environmentalLoudness = radio.environmentalLoudness;
category.underwaterWetLevel = radio.underwaterWetLevel;
category.stonedWetLevel = radio.stonedWetLevel;
category.pitch = radio.pitch;
category.lowPassFilterCutoff = radio.lowPassFilterCutoff;
category.highPassFilterCutoff = radio.highPassFilterCutoff;
