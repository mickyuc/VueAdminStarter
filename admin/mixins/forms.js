export default {
  data: () => ({
    validationErrors: [],
    form: {}
  }),
  computed: {
    isNew () {
      return !this.form._id
    }
  },
  methods: {
    validationError (param) {
      return (this.validationErrors || [])
        .filter(error => error.param === param)
        .map(error => error.msg)
    }
  }
}
