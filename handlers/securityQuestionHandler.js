const Handler = require('./handler');
const bcrypt = require('bcryptjs');

class SecurityQuestionHandler extends Handler {
    constructor(userModel, questionKey, answerKey) {
        super();
        this.userModel = userModel;
        this.questionKey = questionKey;
        this.answerKey = answerKey;
    }

    async handle(request) {
        const { email, answers } = request;
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }
        const providedAnswer = answers[this.answerKey];
        const correctAnswer = user[this.answerKey];

        const isMatch = await bcrypt.compare(providedAnswer, correctAnswer);
        if (!isMatch) {
            throw new Error('Incorrect answer to security question');
        }

        console.log(`${this.questionKey} verified.`);
        return super.handle(request);
    }
}

module.exports = SecurityQuestionHandler;
