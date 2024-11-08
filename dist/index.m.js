/*!
 * cpf-cnpj-validator v1.1.0
 * (c) 2024-present Carvalho, Vinicius Luiz <carvalho.viniciusluiz@gmail.com>
 * Released under the MIT License.
 */
var BLACKLIST = ['00000000000', '11111111111', '22222222222', '33333333333', '44444444444', '55555555555', '66666666666', '77777777777', '88888888888', '99999999999', '12345678909'];
var STRICT_STRIP_REGEX = /[.-]/g;
var LOOSE_STRIP_REGEX = /[^\d]/g;
var verifierDigit = function (digits) {
    var numbers = digits.split('').map(function (number) {
        return parseInt(number, 10);
    });
    var modulus = numbers.length + 1;
    var multiplied = numbers.map(function (number, index) { return number * (modulus - index); });
    var mod = multiplied.reduce(function (buffer, number) { return buffer + number; }) % 11;
    return mod < 2 ? 0 : 11 - mod;
};
var strip = function (number, strict) {
    var regex = strict ? STRICT_STRIP_REGEX : LOOSE_STRIP_REGEX;
    return (number || '').replace(regex, '');
};
var format = function (number) {
    return strip(number).replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
};
var isValid = function (number, strict) {
    var stripped = strip(number, strict);
    if (!stripped) {
        return false;
    }
    if (stripped.length !== 11) {
        return false;
    }
    if (BLACKLIST.includes(stripped)) {
        return false;
    }
    var numbers = stripped.substr(0, 9);
    numbers += verifierDigit(numbers);
    numbers += verifierDigit(numbers);
    return numbers.substr(-2) === stripped.substr(-2);
};
var generate = function (formatted) {
    var numbers = '';
    for (var i = 0; i < 9; i += 1) {
        numbers += Math.floor(Math.random() * 9);
    }
    numbers += verifierDigit(numbers);
    numbers += verifierDigit(numbers);
    return formatted ? format(numbers) : numbers;
};
var cpf = {
    verifierDigit: verifierDigit,
    strip: strip,
    format: format,
    isValid: isValid,
    generate: generate
};

var BLACKLIST$1 = ['00000000000000', '11111111111111', '22222222222222', '33333333333333', '44444444444444', '55555555555555', '66666666666666', '77777777777777', '88888888888888', '99999999999999'];
var STRICT_STRIP_REGEX$1 = /[-\\/.]/g;
var LOOSE_STRIP_REGEX$1 = /[^\d]/g;
var verifierDigit$1 = function (digits) {
    var index = 2;
    var reverse = digits.split('').reduce(function (buffer, number) {
        return [parseInt(number, 10)].concat(buffer);
    }, []);
    var sum = reverse.reduce(function (buffer, number) {
        buffer += number * index;
        index = index === 9 ? 2 : index + 1;
        return buffer;
    }, 0);
    var mod = sum % 11;
    return mod < 2 ? 0 : 11 - mod;
};
var strip$1 = function (number, strict) {
    var regex = strict ? STRICT_STRIP_REGEX$1 : LOOSE_STRIP_REGEX$1;
    return (number || '').replace(regex, '');
};
var format$1 = function (number) {
    return strip$1(number).replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
};
var isValid$1 = function (number, strict) {
    var stripped = strip$1(number, strict);
    if (!stripped) {
        return false;
    }
    if (stripped.length !== 14) {
        return false;
    }
    if (BLACKLIST$1.includes(stripped)) {
        return false;
    }
    var numbers = stripped.substr(0, 12);
    numbers += verifierDigit$1(numbers);
    numbers += verifierDigit$1(numbers);
    return numbers.substr(-2) === stripped.substr(-2);
};
var generate$1 = function (formatted) {
    var numbers = '';
    for (var i = 0; i < 12; i += 1) {
        numbers += Math.floor(Math.random() * 9);
    }
    numbers += verifierDigit$1(numbers);
    numbers += verifierDigit$1(numbers);
    return formatted ? format$1(numbers) : numbers;
};
var cnpj = {
    verifierDigit: verifierDigit$1,
    strip: strip$1,
    format: format$1,
    isValid: isValid$1,
    generate: generate$1
};

var validator = function (joi) { return ({
    type: 'document',
    base: joi.string(),
    messages: {
        'document.cpf': 'CPF inválido',
        'document.cnpj': 'CNPJ inválido'
    },
    rules: {
        cpf: {
            validate: function validate(value, helpers, args, options) {
                if (!cpf.isValid(value)) {
                    return helpers.error('document.cpf');
                }
                return value;
            }
        },
        cnpj: {
            validate: function validate(value, helpers, args, options) {
                if (!cnpj.isValid(value)) {
                    return helpers.error('document.cnpj');
                }
                return value;
            }
        }
    }
}); };

export { cpf, cnpj, validator };
export default validator;
