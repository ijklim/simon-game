const gameButtons = [
  { color: 'green', sound: '' },
  { color: 'red', sound: '' },
  { color: 'yellow', sound: '' },
  { color: 'blue', sound: '' },
];

Vue.component('game-pad', {
  template: `
    <v-card class="white elevation-10 game-pad">
      <v-container grid-list-lg>
        <v-layout wrap>
          <v-flex xs6 v-for="(button, index) in buttons" :key="button.id">
            <game-buttons :audio-ctx="audioCtx" :color="button.color" :sound-frequency="index * 50 + 130"></game-buttons>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  `,
  data () {
    return {
      audioCtx: null,
      buttons: gameButtons
    }
  },
  props: {
   
  },
  mounted () {
    let AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();
  }
});