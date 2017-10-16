function get(req, res) {
  res.render(
    'signin',
    {
      email: '',
      errorCode: null,
      isSubmitted: false
    }
  );
}

module.exports = get;
