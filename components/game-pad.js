const gameButtons = ['green', 'red', 'yellow', 'blue'];

Vue.component('game-pad', {
  template: `
    <v-card class="white elevation-10 game-pad">
      <v-container grid-list-lg>
        <v-layout wrap justify-center>
          
          <v-flex xs6 v-for="button in buttons" :key="button.id">
          <!--Test: {{ button }}-->
            
            <game-buttons
              :audio-ctx="audioCtx"
              :color="button.color"
              :is-on="button.isOn"
              :sound-frequency="1 * 50 + 130"
            />
            
          </v-flex>

          <!-- <v-toolbar flat floating class="transparent"> -->
          <v-flex xs12 text-xs-center>
            <v-chip class="elevation-5"><h3>Count: {{ buttonsToMatch.length ? buttonsToMatch.length : '--' }}</h3></v-chip>
            <v-btn
              @click="resetGame"
              :color="buttonsToMatch.length ? 'warning' : 'error'"
            >
              {{ buttonsToMatch.length ? 'Reset' : 'Start' }}
            </v-btn>
          </v-flex>
          <!-- </v-toolbar> -->

        </v-layout>
      </v-container>
    </v-card>
  `,
  data () {
    return {
      audioCtx: null,
      buttons: [],
      buttonsToMatch: [],
    }
  },
  props: {
   
  },
  methods: {
    pressButtons (buttonsToMatch) {
      if (buttonsToMatch.length === 0) return;

      let color = buttonsToMatch[0];
      let index = gameButtons.indexOf(color);
      this.buttons[index].isOn = true;
      setTimeout(_ => {
        this.buttons[index].isOn = false;
        setTimeout(_ => {
          // Press remaining buttons
          this.pressButtons(buttonsToMatch.slice(1))
        }, 200);
      }, 700);
    },
    resetGame () {
      this.buttonsToMatch = ['blue', 'red', 'red', 'green'];
      this.pressButtons(this.buttonsToMatch);
    }
  },
  mounted () {
    let AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();

    for (color of gameButtons) {
      this.buttons.push({
        color: color,
        isOn: false
      });
    }
    // console.log('toremove: ', this.buttons)
  }
});