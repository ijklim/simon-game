const gameButtons = ['green', 'red', 'yellow', 'blue'];
const DURATION_WRONG_BUTTON_CLICKED = 2000;
const DURATION_WRONG_BUTTON_INDICATOR_FLASH = 300;
const DURATION_NEXT_SEQUENCE = 750;
const DURATION_ACTIVATION_HOLD_DOWN_BUTTON = 700;
const DURATION_ACTIVATION_NEXT_BUTTON = 200;

Vue.component('game-pad', {
  template: `
    <v-card class="elevation-10 teal lighten-5">
      <v-container grid-list-lg>
        <v-layout wrap justify-center>
          
          <v-flex xs6 v-for="(button, index) in buttons" :key="button.id">
            
            <game-buttons
              :audio-ctx="audioCtx"
              :block-player-input="blockPlayerInput"
              :color="button.color"
              :is-on="button.isOn"
              :next-color-in-sequence="nextColorInSequence"
              :sound-frequency="index * 30 + 150"
              @game-button-clicked="gameButtonClicked"
              @wrong-game-button-clicked="wrongButtonClicked = true"
            />
            
          </v-flex>

          <v-flex xs12 text-xs-center>
            <v-chip
              class="elevation-5"
              style="width:110px;"
              :class="{ 'red': wrongButtonClicked }"
            >
              <h3 class="text-xs-center" v-html="countDisplay"></h3>
            </v-chip>
            <v-btn
              @click="resetGame"
              :color="buttonsToMatch.length ? 'warning' : 'error'"
            >
              {{ buttonsToMatch.length ? 'Reset' : 'Start' }}
            </v-btn>
          </v-flex>

        </v-layout>
      </v-container>
    </v-card>
  `,
  data () {
    return {
      audioCtx: null,
      blockPlayerInput: false,
      buttons: [],
      buttonsToMatch: [],
      pressCount: 0,
      wrongButtonClicked: false,
      wrongButtonTimer: 0
    }
  },
  computed: {
    countDisplay () {
      // return '<div style="80px;">!x!</div>';
      if (this.buttonsToMatch.length === 0) return 'Ready: --';
      if (this.wrongButtonClicked) {
        if (this.wrongButtonTimer % 2) return '<div style="width:85px;">!!!</div>';
        return '&nbsp;';
      }

      return 'Count: <pre style="display:inline;">' + 
             (' ' + this.buttonsToMatch.length).slice(-2) +
             '</pre>';
    },
    nextColorInSequence () {
      if (this.buttonsToMatch.length === 0) return '';

      return this.buttonsToMatch[this.pressCount];
    }
  },
  watch: {
    wrongButtonClicked (value) {
      if (!value) return;

      let interval = setInterval(_ => {
        this.wrongButtonTimer++;
      }, DURATION_WRONG_BUTTON_INDICATOR_FLASH);

      setTimeout(_ => {
        this.wrongButtonClicked = false;
        clearInterval(interval);
      }, DURATION_WRONG_BUTTON_CLICKED);
    }
  },
  methods: {
    /**
     * Highlight buttons and play sounds to let user know sequence
     * @param {Array} buttonsToMatch 
     */
    activateButtons (buttonsToMatch) {
      if (buttonsToMatch.length === 0) return this.blockPlayerInput = false;

      let color = buttonsToMatch[0];
      let index = gameButtons.indexOf(color);
      this.buttons[index].isOn = true;
      setTimeout(_ => {
        this.buttons[index].isOn = false;
        setTimeout(_ => {
          // Press remaining buttons
          this.activateButtons(buttonsToMatch.slice(1))
        }, DURATION_ACTIVATION_NEXT_BUTTON);
      }, DURATION_ACTIVATION_HOLD_DOWN_BUTTON);
    },
    /**
     * Add random color from gameButtons to end of array
     * @param {Array} source
     * @return {Array}
     */
    addRandomColorToArray (source) {
      let index = (Math.random() * (gameButtons.length - 1)).toFixed(0);
      let result = source.slice(0);
      result.push(gameButtons[index])
      return result;
    },
    gameButtonClicked (color) {
      if (this.buttonsToMatch.length === 0) return;

      // Correct
      if (this.buttonsToMatch[this.pressCount] === color) {
        if (++this.pressCount === this.buttonsToMatch.length) {
          // All buttons in current sequence clicked, show the next sequence
          setTimeout(() => {
            this.pressCount = 0;
            this.buttonsToMatch = this.addRandomColorToArray(this.buttonsToMatch);
            this.activateButtons(this.buttonsToMatch);
          }, DURATION_NEXT_SEQUENCE);
        }
        return;
      }

      // Wrong button selected
      this.pressCount = 0;
      setTimeout(() => {
        this.activateButtons(this.buttonsToMatch);
      }, DURATION_WRONG_BUTTON_CLICKED);
    },
    resetGame () {
      this.blockPlayerInput = true;
      this.pressCount = 0;
      this.buttonsToMatch = this.addRandomColorToArray([]);
      this.activateButtons(this.buttonsToMatch);
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
  }
});