Vue.component('game-buttons', {
  template: `
    <v-btn
      block
      class="game-button"
      :class="buttonClass"
      @mousedown="pressButton"
      @mouseup="releaseButton"
      @mouseleave="releaseButton"
    >
      &nbsp;
    </v-btn>
  `,
  data () {
    return {
      isButtonReleased: true,
      oscillatorNode: false
    }
  },
  props: {
    audioCtx: {
      type: AudioContext,
      default: {}
    },
    blockPlayerInput: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: ''
    },
    isOn: {
      type: Boolean,
      default: false
    },
    nextColorInSequence: {
      type: String,
      default: ''
    },
    soundFrequency: {
      type: Number,
      default: 200
    }
  },
  computed: {
    buttonClass () {
      let classes = this.color;

      if (this.isOn) classes += ' darken-2';
      else classes += ' elevation-5';

      return classes;
    }
  },
  watch: {
    /**
     * Invoked by computer to notify user of buttons sequence
     * @param {Boolean} value 
     */
    isOn (value) {
      if (!value) return this.stopSound();

      return this.playSound();
    }
  },
  methods: {
    playSound (frequency = null, type = null) {
      if (!this.audioCtx) return;

      this.oscillatorNode = this.audioCtx.createOscillator();
      this.oscillatorNode.type = type || 'sine';
      this.oscillatorNode.frequency.setValueAtTime(frequency || this.soundFrequency, this.audioCtx.currentTime);

      this.oscillatorNode.connect(this.audioCtx.destination);
      
      this.oscillatorNode.start();
    },
    /** 
     * User pressing button
     */
    pressButton () {
      // Prevent conflict
      if (this.blockPlayerInput) return;
      if (!this.isButtonReleased) return;

      let frequency = null;
      let type = null;

      // Play error sound if player picks the wrong color
      if (
        this.nextColorInSequence !== '' &&
        this.nextColorInSequence !== this.color
      ) {
        frequency = 100;
        type = 'triangle';
        this.$emit('wrong-game-button-clicked');
      }

      this.isButtonReleased = false;
      this.playSound(frequency, type);
    },
    releaseButton () {
      if (this.isButtonReleased) return;

      this.stopSound();
      this.isButtonReleased = true;
      this.$emit('game-button-clicked', this.color);
    },
    stopSound () {
      this.oscillatorNode.stop();
    }
  },
  mounted () {
    
  }
});