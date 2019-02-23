module.exports = class Response {
  constructor() {
    this.error = true;
    this.message = 'Something went wrong. Please try again later';
    this.payload = {};
  }

  setSuccess() {
    this.error = false;
  }

  setMessage(message) {
    this.message = message;
  }

  setPayload(payload) {
    this.payload = { ...payload };
  }
};
