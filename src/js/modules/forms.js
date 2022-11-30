export default class Forms {
    constructor(forms) {
        this.forms = document.querySelectorAll(forms);
        this.inputs = document.querySelectorAll('input');
        this.message = {
            loading: 'Идет загрузка',
            success: 'Спасибо! Скоро с вами свяжемся',
            failure: 'Что-то пошло не так',
        };
        this.path = {
            question: 'assets/question.php'
        };
    }

    clearInputs() {
        this.inputs.forEach(input => {
            input.value = '';
        });
    }

    checkMailInputs() {
        const emailInputs = document.querySelectorAll('[type="email"]');

        emailInputs.forEach(input => {
            input.addEventListener('keypress', function (evt) {
                if (evt.key.match(/[^a-z 0-9 @ \.]/ig)) {
                    evt.preventDefault();
                }
            });
        });
    }

    initMask() {
        let setCursorPosition = (pos, elem) => {
            elem.focus();

            if (elem.setSelectionRange) {
                elem.setSelectionRange(pos, pos);
            } else if (elem.createTextRange) {
                let range = elem.createTextRange();

                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();

            }
        };

        function createMask(evt) {
            let matrix = '+1 (___) ___ - ___',
                i = 0,
                def = matrix.replace(/\D/g, ''), /* Получаем / *удаляем* все НЕ цифры и замещаем пустой строкой   */
                val = this.value.replace(/\D/g, ''); /* Динамичное, ввел пользователь */



            if (def.length >= val.length) {
                val = def;
            }

            this.value = matrix.replace(/./g, function (a) {
                return /[_\d]/.test(a) && i < val.length ? val.charAt(i++)
                    : i >= val.length ? '' : a;
            });

            if (evt.type === 'blur') {
                if (this.value.length == 2) {
                    this.value = '';
                }
            } else {
                setCursorPosition(this.value.length, this);
            }

        }

        let inputs = document.querySelectorAll('[name="phone"]');

        inputs.forEach(input => {
            input.addEventListener('input', createMask);
            input.addEventListener('focus', createMask);
            input.addEventListener('blur', createMask);
        });
    }

    async postData(url, data) {
        const res = await fetch(url, {
            method: 'POST',
            body: data
        });

        return await res.text();
    }

    init() {
        this.initMask();
        this.checkMailInputs();
        this.forms.forEach(form => {
            form.addEventListener('submit', (evt) => {
                evt.preventDefault();

                let statusMessage = document.createElement('div');
                statusMessage.classList.add('status');
                statusMessage.style.cssText =
                    `
                margin-top: 15px;
                font-size: 18px;
                color: red;
                text-align: center;
                `;
                form.parentNode.appendChild(statusMessage);

                statusMessage.textContent = this.message.loading;

                const formData = new FormData(form);

                this.postData(this.path.question, formData)
                    .then(res => {
                        console.log(res);
                        statusMessage.textContent = this.message.success;
                    })
                    .catch((error) => {
                        console.log(error);
                        statusMessage.textContent = this.message.failure;
                    })
                    .finally(() => {
                        this.clearInputs();
                        setTimeout(() => {
                            statusMessage.remove();
                        }, 3000);
                    });
            });
        });
    }
}