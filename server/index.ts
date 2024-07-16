import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';
import { ASC_CONFIG } from '../shared/config.js';

const Rebar = useRebar();
const api = Rebar.useApi();

const Keybinder = Rebar.useKeybinder();

// 75 - k
Keybinder.on(75, (player) => {
    alt.emitClient(player, 'startAudioFilterTest', ASC_CONFIG.source);
});
