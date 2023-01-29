// Generate course no.
const subjects = ['ST', 'MA', 'TH', 'EN', 'SO', 'AR', 'AT', 'PE']

const courseNum = () => {
    const subject = subjects[Math.floor(Math.random() * subjects.length)]
    let code = ''
    for (let i = 0; i < 5; i++) {
        code = code + Math.floor(Math.random() * 10)
    }
    return `${subject}${code}`
}

module.exports = { courseNum }