const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const getTime = () => new Date().getTime()

module.exports = {
  randomInt,
  getTime,
}
