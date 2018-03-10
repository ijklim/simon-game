Vue.component('game-buttons', {
  template: `
    <v-btn
      block
      class="game-button"
      :class="buttonClass"
      @mousedown="pressButton"
      @mouseup="releaseButton"
    >
      &nbsp;
    </v-btn>
  `,
  data () {
    return {
      oscillatorNode: false
    }
  },
  props: {
    audioCtx: {
      type: AudioContext,
      default: {}
    },
    color: {
      type: String,
      default: ''
    },
    isOn: {
      type: Boolean,
      default: false
    },
    soundFrequency: {
      type: Number,
      default: 200
    }
  },
  computed: {
    buttonClass () {
      let classes = this.color;

      if (this.isOn) classes += '  darken-3';
      else classes += ' elevation-5';

      return classes;
    }
  },
  watch: {
    isOn (value) {
      if (!value) return this.releaseButton()

      return this.pressButton()
    }
  },
  methods: {
    pressButton () {
      if (!this.audioCtx) return;

      this.oscillatorNode = this.audioCtx.createOscillator();
      this.oscillatorNode.type = "sine";
      this.oscillatorNode.frequency.setValueAtTime(this.soundFrequency, this.audioCtx.currentTime);
      this.oscillatorNode.connect(this.audioCtx.destination);
      
      this.oscillatorNode.start();
    },
    releaseButton () {
      this.oscillatorNode.stop();
      this.$emit('button-clicked', this.color);
    }
  },
  mounted () {
    
  }
});