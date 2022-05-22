import i18n from './vue-i18n'
import moment from 'moment';
import idVerification from "./identifier-verification";

class Validation {

    rules = [];
    constructor() {
        //console.log(`new instance of Validation initialized`);
        this.idVerify = new idVerification();
    }

    required() {
        this.rules.push({ required: true });
        return this;
    }

    email() {
        this.rules.push({ email: true });
        return this;
    }

    url() {
        this.rules.push({ url: true });
        return this;
    }

    alpha() {
        this.rules.push({ alpha: true });
        return this;
    }

    alphaTr() {
        this.rules.push({ alphaTr: true });
        return this;
    }

    alphaTrNum() {
        this.rules.push({ alphaTrNum: true });
        return this;
    }

    alphaDash() {
        this.rules.push({ alphaDash: true });
        return this;
    }

    alphaNum() {
        this.rules.push({ alphaNum: true });
        return this;
    }

    alphaDashNum() {
        this.rules.push({ alphaDashNum: true });
        return this;
    }

    date(format = null) {
        if (!format) {
            format = "YYYY-MM-DD";
        }
        this.rules.push({ date: format });
        return this;
    }

    time() {
        this.rules.push({ time: true });
        return this;
    }

    integer() {
        this.rules.push({ integer: true });
        return this;
    }

    numeric() {
        this.rules.push({ numeric: true });
        return this;
    }

    ip() {
        this.rules.push({ ip: true });
        return this;
    }
    vin() {
        this.rules.push({ vin: true });
        return this;
    }
    same(other) {
        this.rules.push({ same: other });
        return this;
    }

    between(min, max) {
        this.rules.push({ between: { min: min, max: max } });
        return this;
    }

    vkn(min, max) {
        this.rules.push({ vkn: { min: min, max: max } });
        return this;
    }
    vergiKimlik(len) {
        this.rules.push({ vergiKimlik: { len: len} });
        return this;
    }
    tcKimlik(len) {
        this.rules.push({ tcKimlik: { len: len} });
        return this;
    }

    //todo: dontAllowTheese
    password(includeAZaz, includeNum, includeSpecialChar, dontAllowSequential, dontAllowTheese) {
        this.rules.push({
            password: {
                includeAZaz: includeAZaz === undefined ? true : includeAZaz,
                includeNum: includeNum === undefined ? true : includeNum,
                includeSpecialChar: includeSpecialChar === undefined ? true : includeSpecialChar,
                dontAllowSequential: dontAllowSequential === undefined ? true : dontAllowSequential,
                dontAllowTheese: dontAllowTheese
            }
        });
        return this;
    }

    max(val) {
        this.rules.push({ max: val });
        return this;
    }

    min(val) {
        this.rules.push({ min: val });
        return this;
    }

    minCurrency(compare, min) {
        this.rules.push({ minCurrency: { compare: compare, min: min } });
        return this;
    }

    compare(val) {
        this.rules.push({ compare: val });
        return this;
    }

    charBetween(min, max) {
        this.rules.push({ charBetween: { min: min, max: max } });
        return this;
    }

    charMax(val) {
        this.rules.push({ charMax: val });
        return this;
    }

    charMin(val) {
        this.rules.push({ charMin: val });
        return this;
    }

    different(val) {
        this.rules.push({ different: val });
        return this;
    }

    digits(val) {
        this.rules.push({ digits: val });
        return this;
    }

    in(val) {
        this.rules.push({ in: val });
        return this;
    }

    notIn(val) {
        this.rules.push({ notIn: val });
        return this;
    }

    digitsBetween(min, max) {
        this.rules.push({ digitsBetween: { min: min, max: max } });
        return this;
    }

    after(date) {
        this.rules.push({ after: date });
        return this;
    }

    before(date) {
        this.rules.push({ before: date });
        return this;
    }

    afterEqual(date) {
        this.rules.push({ afterEqual: date });
        return this;
    }

    beforeEqual(date) {
        this.rules.push({ beforeEqual: date });
        return this;
    }

    afterEqualDateTime(toTime, toDate, thisTime, thisDate) {
        this.rules.push({ afterEqualDateTime: { toTime: toTime, toDate: toDate, thisTime: thisTime, thisDate: thisDate, equal: true } });
        return this;
    }

    afterDateTime(toTime, toDate, thisTime, thisDate) {
        this.rules.push({ afterDateTime: { toTime: toTime, toDate: toDate, thisTime: thisTime, thisDate: thisDate, equal: false } });
        return this;
    }

    afterTime(time, toDate, thisDate) {
        this.rules.push({ afterTime: { toDate: toDate, thisDate: thisDate, time: time, equal: false } });
        return this;
    }

    beforeTime(time, toDate, thisDate) {
        this.rules.push({ beforeTime: { toDate: toDate, thisDate: thisDate, time: time, equal: false } });
        return this;
    }

    afterEqualTime(time, toDate, thisDate) {
        this.rules.push({ afterTime: { toDate: toDate, thisDate: thisDate, time: time, equal: true } });
        return this;
    }

    beforeEqualTime(time, toDate, thisDate) {
        this.rules.push({ beforeTime: { toDate: toDate, thisDate: thisDate, time: time, equal: true } });
        return this;
    }

    gibPhone() {
        this.rules.push({ gibPhone: true });
        return this;
    }

    iban() {
        this.rules.push({ iban: 26 });
        return this;
    }
    isEqualPositivity(totalValue) {
        this.rules.push({ isEqualPositivity: totalValue > 0 ? true : false });
        return this;
    }
    isRepeatedNumber(isRepeatedNumber) {
        this.rules.push({
            isRepeatedNumber: {
                isRepeatedNumber: isRepeatedNumber === undefined ? true : isRepeatedNumber,
            }
        });
        return this;
    }
    notVal(val) {
        this.rules.push({ notVal: val }); //{input} value can not be {val}
        return this;
    }
    custom(func) {
        this.rules.push({ custom: func });
        return this;
    }

    // TODO:
    // unique(check) { 
    //     this.rules.push({ unique: { check: check } });
    //     return this;
    // }
    //requiredIf(cond) { //TODO:
    //     this.rules.push({ requiredIf: cond });
    //     return this;
    // }

    _hasRule(rule) {
        //console.log(`_hasRule: ${rule} in ${JSON.stringify(this.rules)}`);
        for (let i in this.rules) {
            let r = this.rules[i];
            if (r[rule] !== undefined) {
                return true;
            }
        }
        return false;
    }
    _getRuleByName(rule) {
        for (let i in this.rules) {
            let r = this.rules[i];
            if (r[rule] !== undefined) {
                return r;
            }
        }
    }

    isRequired() {
        return this._hasRule('required');
    }

    getRequiredStar() {
        return this.isRequired() ? "*" : "";
    }

    isEqualsPositivity(totalValue, value) {
        if (value == 0)
            return true;
        if (totalValue > 0) {
            return value > 0 ? true : false
        } else {
            return value < 0 ? true : false
        }
    }


    toRules(input) {
        let genRules = [];

        if (this._hasRule('required')) {
            genRules.push(
                v => {
                    // console.log(`required worked!`);
                    // console.log(v);
                    if (v != null) {
                        return !!v.toString() || i18n.t("validation.required", { input: input });
                    }
                    return !!v || i18n.t("validation.required", { input: input })

                }
            );
        }

        if (this._hasRule('email')) {
            genRules.push(
                v => { /* eslint-disable */
                    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return (!v || re.test(String(v).toLowerCase())) || i18n.t("validation.email", { input: input });
                }
            );
        }

        if (this._hasRule('url')) {
            genRules.push(
                v => { /* eslint-disable */
                    var re = new RegExp('^(https?:\\/\\/)?' + // protocol
                        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
                    return (!v || re.test(String(v).toLowerCase())) || i18n.t("validation.url", { input: input });
                }
            );
        }

        if (this._hasRule('alpha')) {
            genRules.push(
                v => { /* eslint-disable */
                    //let re = new RegExp("^(?:^[a-z]+$)$", 'i');
                    let re = new RegExp("^(?:^[a-z]+$)$", 'i');
                    return (!v || re.test(String(v).toLowerCase())) || i18n.t("validation.alpha", { input: input });
                }
            );
        }
        if (this._hasRule('alphaTr')) {
            genRules.push(
                v => { /* eslint-disable */
                    //let re = new RegExp("^(?:^[a-z]+$)$", 'i');
                    let re = new RegExp(/^[a-zA-Z ğüşöçıİĞÜŞÖÇ]+$/, 'i');
                    return (!v || re.test(String(v))) || i18n.t("validation.alphaTr", { input: input });
                }
            );
        }

        if (this._hasRule('alphaTrNum')) {
            genRules.push(
                v => { /* eslint-disable */
                    //let re = new RegExp("^(?:^[a-z]+$)$", 'i');
                    let re = new RegExp(/^[a-zA-Z0-9 ğüşöçıİĞÜŞÖÇ]+$/, 'i');
                    return (!v || re.test(String(v))) || i18n.t("validation.alphaTrNum", { input: input });
                }
            );
        }

        if (this._hasRule('alphaDash')) {
            genRules.push(
                v => { /* eslint-disable */
                    let re = new RegExp("^(?:^[\\w\\-_]+$)$", 'i');
                    return (!v || re.test(String(v).toLowerCase())) || i18n.t("validation.alphaDash", { input: input });
                }
            );
        }

        if (this._hasRule('alphaNum')) {
            genRules.push(
                v => { /* eslint-disable */
                    let re = new RegExp("^(?:^[a-z0-9]+$)$", 'i');
                    return (!v || re.test(String(v).toLowerCase())) || i18n.t("validation.alphaNum", { input: input });
                }
            );
        }

        if (this._hasRule('alphaDashNum')) {
            genRules.push(
                v => { /* eslint-disable */
                    let re = new RegExp("^(?:^[a-z0-9]+$)$", 'i'); //num
                    let re2 = new RegExp("^(?:^[\\w\\-_]+$)$", 'i'); //dash
                    return (!v || re.test(String(v).toLowerCase()) || re2.test(String(v).toLowerCase())) || i18n.t("validation.alphaDashNum", { input: input });
                }
            );
        }

        if (this._hasRule('alphaNum')) {
            genRules.push(
                v => { /* eslint-disable */
                    let re = new RegExp("^(?:^[a-z0-9]+$)$", 'i');
                    return (!v || re.test(String(v).toLowerCase())) || i18n.t("validation.alphaNum", { input: input });
                }
            );
        }

        if (this._hasRule('date')) {
            let rule = this._getRuleByName('date');
            const min = 1800;
            
            genRules.push(
                v => {
                    let boolMin = moment(v, rule.date).year() > min;
                    return (boolMin && (!v || (v.length == 10 && moment(v, rule.date).isValid())) ) || i18n.t("validation.date", { input: input })
                }
            );
        }

        if (this._hasRule('time')) {
            let rule = this._getRuleByName('time');
            genRules.push(
                v => (!v || (v.length == 5 && new RegExp("([0-1][0-9]|2[0-3]):([0-5][0-9])").test(v))) || i18n.t("validation.time", { input: input })
            );
        }

        if (this._hasRule('integer')) {
            genRules.push(
                v => (!v || new RegExp("^(?:-?\\d+)$", 'i').test(v)) || i18n.t("validation.integer", { input: input })
            );
        }

        if (this._hasRule('numeric')) {
            genRules.push(
                v => (!v || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(v)) || i18n.t("validation.numeric", { input: input })
            );
        }

        if (this._hasRule('vkn')) {
            let rule = this._getRuleByName('vkn');
            genRules.push(
                v => (!v || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(v) && (v.length == rule.vkn.max || v.length == rule.vkn.min)) || i18n.t("validation.vkn", { input: input, min: rule.vkn.min, max: rule.vkn.max })
            );
        }

        if (this._hasRule('vergiKimlik')) {
            let rule = this._getRuleByName('vergiKimlik');
            genRules.push(
                v => {
                    let bool1 = /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(v ?? '');
                    let bool2 = v?.length == rule.vergiKimlik.len;
                    let bool3 = this.idVerify.checkVKN(v ?? '');
                    return (!v || (bool1  && bool2 && bool3)) || i18n.t("validation.vergiKimlik", { input: input, len: rule.vergiKimlik.len });
                }
            );
        }

        if (this._hasRule('tcKimlik')) {
            let rule = this._getRuleByName('tcKimlik');
            genRules.push(
                v => {
                    let bool1 = /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(v ?? '');
                    let bool2 = v?.length == rule.tcKimlik.len;
                    let bool3 = this.idVerify.check(v ?? '');
                    return (!v || (bool1  && bool2 && bool3)) || i18n.t("validation.tcKimlik", { input: input, len: rule.tcKimlik.len });
                }
            );
        }

        if (this._hasRule('ip')) {
            genRules.push(
                v => {
                    let bool1 = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(v);
                    let bool2 = /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i.test(v);
                    return (!v || bool1 || bool2) || i18n.t("validation.ip", { input: input })
                }
            );
        }

        if (this._hasRule('vin')) {
            genRules.push(
                v => {
                    let bool1 = /^((?!(0))(?!(X))[(A-H|J-N|P|R-Z|0-9)]{17})$/i.test(v);
                    return (!v || bool1) || i18n.t("validation.vin", { input: input })
                }
            );
        }

        if (this._hasRule('same')) {
            let rule = this._getRuleByName('same');
            genRules.push(
                v => (!v || rule.same == v) || i18n.t("validation.same", { input: input, value: rule.same })
            );
        }

        if (this._hasRule('different')) {
            let rule = this._getRuleByName('different');
            genRules.push(
                v => (!v || rule.different != v) || i18n.t("validation.different", { input: input, value: rule.different })
            );
        }

        if (this._hasRule('between')) {
            let rule = this._getRuleByName('between');
            genRules.push(
                v => {
                    return (!v || (parseFloat(v) >= rule.between.min && parseFloat(v) <= rule.between.max)) || i18n.t("validation.between", { input: input, min: rule.between.min, max: rule.between.max })
                }
            );
        }

        if (this._hasRule('digits')) {
            let rule = this._getRuleByName('digits');
            genRules.push(
                v => (!v || (v + "").length == rule.digits) || i18n.t("validation.digits", { input: input, digits: rule.digits })
            );
        }

        if (this._hasRule('digitsBetween')) {
            let rule = this._getRuleByName('digitsBetween');
            genRules.push(
                v => {
                    return (!v || ((v + "").length >= rule.digitsBetween.min && (v + "").length <= rule.digitsBetween.max)) || i18n.t("validation.digitsBetween", { input: input, min: rule.digitsBetween.min, max: rule.digitsBetween.max })
                }
            );
        }
        if (this._hasRule('charBetween')) {
            let rule = this._getRuleByName('charBetween');
            genRules.push(
                v => {
                    return (!v || ((v + "").length >= rule.charBetween.min && (v + "").length <= rule.charBetween.max)) || i18n.t("validation.charBetween", { input: input, min: rule.charBetween.min, max: rule.charBetween.max })
                }
            );
        }

        if (this._hasRule('max')) {
            let rule = this._getRuleByName('max');
            genRules.push(
                v => (!v || parseFloat(v) <= rule.max) || i18n.t("validation.max", { input: input, max: rule.max })
            );
        }
        if (this._hasRule('charMax')) {
            let rule = this._getRuleByName('charMax');
            genRules.push(
                v => (!v || (v + "").length <= rule.charMax) || i18n.t("validation.charMax", { input: input, max: rule.charMax })
            );
        }

        if (this._hasRule('min')) {
            let rule = this._getRuleByName('min');
            genRules.push(
                v => (!v || parseFloat(v) >= rule.min) || i18n.t("validation.min", { input: input, min: rule.min })
            );
        }

        if (this._hasRule('minCurrency')) {
            let rule = this._getRuleByName('minCurrency');
            genRules.push(
                v => (!v || parseFloat(v.replace(".", "").replace(",", ".")) >= parseFloat(rule.minCurrency.min)) || i18n.t("validation.minCurrency", { input: input, compare: rule.minCurrency.compare, min: rule.minCurrency.min })
            );
        }

        if (this._hasRule('compare')) {
            let rule = this._getRuleByName('compare');
            genRules.push(
                v => (!v) || i18n.t("validation.compare", { input: input, compare: rule.compare })
            );
        }

        if (this._hasRule('charMin')) {
            let rule = this._getRuleByName('charMin');
            genRules.push(
                v => (!v || (v + "").length >= rule.charMin) || i18n.t("validation.charMin", { input: input, min: rule.charMin })
            );
        }

        if (this._hasRule('in')) {
            let rule = this._getRuleByName('in');
            genRules.push(
                v => (!v || !rule.in || rule.in.length < 1 || (rule.in.indexOf(v) > -1)) || i18n.t("validation.in", { input: input, set: rule.in.join(",") })
            );
        }

        if (this._hasRule('notIn')) {
            let rule = this._getRuleByName('notIn');
            genRules.push(
                v => (!v || !rule.notIn || rule.notIn.length < 1 || (rule.notIn.indexOf(v) == -1)) || i18n.t("validation.notIn", { input: input, set: rule.notIn.join(",") })
            );
        }

        if (this._hasRule('after')) {
            let rule = this._getRuleByName('after');
            genRules.push(
                v => (!v || !rule.after || (v.length == 10 && moment(v, "YYYY-MM-DD").isAfter(rule.after, 'YYYY-MM-DD'))) || i18n.t("validation.after", { input: input, date: rule.after })
            );
        }

        if (this._hasRule('before')) {
            let rule = this._getRuleByName('before');
            genRules.push(
                v => (!v || !rule.before || (v.length == 10 && moment(v, "YYYY-MM-DD").isBefore(rule.before, 'YYYY-MM-DD'))) || i18n.t("validation.before", { input: input, date: rule.before })
            );
        }
        if (this._hasRule('afterEqual')) {
            let rule = this._getRuleByName('afterEqual');
            genRules.push(
                v => (!v || !rule.afterEqual || (v.length == 10 && moment(v, "YYYY-MM-DD").isSameOrAfter(rule.afterEqual, 'YYYY-MM-DD'))) || i18n.t("validation.afterEqual", { input: input, date: rule.afterEqual })
            );
        }

        if (this._hasRule('beforeEqual')) {
            let rule = this._getRuleByName('beforeEqual');
            genRules.push(
                v => (!v || !rule.beforeEqual || (v.length == 10 && moment(v, "YYYY-MM-DD").isSameOrBefore(rule.beforeEqual, 'YYYY-MM-DD'))) || i18n.t("validation.beforeEqual", { input: input, date: rule.beforeEqual })
            );
        }
        if (this._hasRule('afterTime')) {
            //afterTime(time, date) { this.rules.push({ afterTime: { date: date, time: time } });
            let rule = this._getRuleByName('afterTime');
            genRules.push(
                v => {
                    var includeEqual = rule.afterTime.equal;
                    var equalKey = includeEqual ? "Equal" : "";

                    // console.log(`rule.afterTime`);
                    // console.log(rule);
                    if (!v || !rule.afterTime || !rule.afterTime.time) {
                        return true;
                    }
                    if (v.length != 5 || !new RegExp("([0-1][0-9]|2[0-3]):([0-5][0-9])").test(v)) {
                        return true; //not his job to validate time;
                    }
                    if (!rule.afterTime.toDate || !rule.afterTime.thisDate) {
                        if (includeEqual) {
                            if (v.replace(":", "") >= rule.afterTime.time.replace(":", "")) {
                                return true;
                            }
                        } else {
                            if (v.replace(":", "") > rule.afterTime.time.replace(":", "")) {
                                return true;
                            }
                        }
                        return i18n.t("validation.afterTime" + equalKey, { input: input, time: rule.afterTime.time });
                    }
                    let mmt = moment(rule.afterTime.thisDate + " " + v, "YYYY-MM-DD hh:mm");
                    if (includeEqual) {
                        if (!mmt.isSameOrAfter(rule.afterTime.toDate + " " + rule.afterTime.time, 'YYYY-MM-DD hh:mm')) {
                            return i18n.t("validation.afterTime" + equalKey, { input: input, time: moment(rule.afterTime.toDate + " " + rule.afterTime.time).format("L LT") });
                        };
                    } else {
                        if (!mmt.isAfter(rule.afterTime.toDate + " " + rule.afterTime.time, 'YYYY-MM-DD hh:mm')) {
                            return i18n.t("validation.afterTime" + equalKey, { input: input, time: moment(rule.afterTime.toDate + " " + rule.afterTime.time).format("L LT") });
                        };
                    }
                    return true;
                }
            );
        }
        if (this._hasRule('beforeTime')) {
            //afterTime(time, date) { this.rules.push({ afterTime: { date: date, time: time } });
            let rule = this._getRuleByName('beforeTime');
            genRules.push(
                v => {
                    var includeEqual = rule.beforeTime.equal;
                    var equalKey = includeEqual ? "Equal" : "";

                    if (!v || !rule.beforeTime || !rule.beforeTime.time) {
                        return true;
                    }
                    if (v.length != 5 || !new RegExp("([0-1][0-9]|2[0-3]):([0-5][0-9])").test(v)) {
                        return true; //not his job to validate time;
                    }
                    if (!rule.beforeTime.toDate || !rule.beforeTime.thisDate) {
                        if (includeEqual) {
                            if (v.replace(":", "") <= rule.beforeTime.time.replace(":", "")) {
                                return true;
                            }
                        } else {
                            if (v.replace(":", "") < rule.beforeTime.time.replace(":", "")) {
                                return true;
                            }
                        }

                        return i18n.t("validation.beforeTime" + equalKey, { input: input, time: rule.beforeTime.time });
                    }
                    let mmt = moment(rule.beforeTime.thisDate + " " + v, "YYYY-MM-DD hh:mm");
                    if (includeEqual) {
                        if (!mmt.isSameOrBefore(rule.beforeTime.toDate + " " + rule.beforeTime.time, 'YYYY-MM-DD hh:mm')) {
                            return i18n.t("validation.beforeTime" + equalKey, { input: input, time: moment(rule.beforeTime.toDate + " " + rule.beforeTime.time).format("L LT") });
                        };
                    } else {
                        if (!mmt.isBefore(rule.beforeTime.toDate + " " + rule.beforeTime.time, 'YYYY-MM-DD hh:mm')) {
                            return i18n.t("validation.beforeTime" + equalKey, { input: input, time: moment(rule.beforeTime.toDate + " " + rule.beforeTime.time).format("L LT") });
                        };
                    }
                    return true;
                }
            );
        }

        if (this._hasRule('afterEqualDateTime')) {
            let rule = this._getRuleByName('afterDateTime');
            genRules.push(
                v => {
                    var includeEqual = rule.afterDateTime.equal;
                    var equalKey = includeEqual ? "Equal" : "";

                    var thisTime = rule.afterDateTime.thisTime;
                    var toTime = rule.afterDateTime.toTime;
                    var thisDate = rule.afterDateTime.thisDate;
                    var toDate = rule.afterDateTime.toDate;

                    if (!thisDate || !thisTime || !toDate || !toTime) {
                        return true;
                    }

                    if (toDate == thisDate) {
                        if (includeEqual) {
                            if (thisTime.replace(":", "") >= toTime.replace(":", "")) {
                                return true;
                            }
                        } else {
                            if (thisTime.replace(":", "") > toTime.replace(":", "")) {
                                return true;
                            }
                        }
                        return i18n.t("validation.afterTime" + equalKey, { input: input, time: moment(toDate + " " + toTime).format("L LT") });
                    }

                    return true;
                }
            );
        }

        if (this._hasRule('afterDateTime')) {
            let rule = this._getRuleByName('afterDateTime');
            genRules.push(
                v => {
                    var includeEqual = rule.afterDateTime.equal;
                    var equalKey = includeEqual ? "Equal" : "";

                    var thisTime = rule.afterDateTime.thisTime;
                    var toTime = rule.afterDateTime.toTime;
                    var thisDate = rule.afterDateTime.thisDate;
                    var toDate = rule.afterDateTime.toDate;

                    //  console.log("thisDate thisTime: " + thisDate + " - " + thisTime);
                    //  console.log("toDate toTime: " + toDate + " - " + toTime);

                    if (!thisDate || !thisTime || !toDate || !toTime) {
                        return true;
                    }

                    if (toDate == thisDate) {
                        if (includeEqual) {
                            if (thisTime.replace(":", "") >= toTime.replace(":", "")) {
                                return true;
                            }
                        } else {
                            if (thisTime.replace(":", "") > toTime.replace(":", "")) {
                                return true;
                            }
                        }
                        return i18n.t("validation.afterTime" + equalKey, { input: input, time: moment(toDate + " " + toTime).format("L LT") });
                    }

                    return true;
                }
            );
        }


        if (this._hasRule('password')) {
            let rule = this._getRuleByName('password').password;


            genRules.push(
                v => {
                    if (!v) {
                        return true;
                    }
                    console.log(`bool &= !rule.includeNum || /\d/.test(v); ${!rule.includeNum} || ${/\d/.test(v)}`)
                    if (rule.includeNum && !/\d/.test(v)) {
                        return i18n.t('validation.passwordNum');
                    }
                    if (rule.includeAZaz && !(/[a-z]/.test(v) && /[A-Z]/.test(v))) {
                        return i18n.t('validation.passwordAZaz');
                    }

                    if (rule.includeSpecialChar) {
                        let re = new RegExp(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/);
                        if (!re.test(v)) {
                            return i18n.t('validation.passwordSpecial');
                        }
                    }
                    if (rule.dontAllowSequential) {
                        var $pre_char = false;
                        var $seq = 1;
                        var $un_seq = true;
                        for (var $i = 0; $i < v.length; $i++) {
                            var $char = v[$i];
                            if ($char == $pre_char) {
                                $seq++;
                                if (4 <= $seq) {
                                    $un_seq = false;
                                    break;
                                }
                            }
                            $pre_char = $char;
                        }
                        if (!$un_seq) {
                            return i18n.t('validation.passwordFreeSeq');
                        }
                    }
                    //TODO:dontAllowTheeseText
                    //i18n.t('validation.passwordDontAllowTheese');
                    return true;
                }
            );
        }

        if (this._hasRule('gibPhone')) {
            let re = /^[1-9]{1}[0-9]{9}$/;
            genRules.push(
                v => {
                    let bool = re.test(v + "");

                    var ret = (!v || !!bool || i18n.t("validation.phone", { input: input }))
                    console.log(`gibPhone worked for value: ${v} => ${!v} || ${!!bool} === ${ret})}`);
                    return ret;
                }
            );

        }

        if (this._hasRule('iban')) {
            let rule = this._getRuleByName('iban');
            genRules.push(
                v => (!v || (v + "").length >= rule.iban) || i18n.t("validation.iban", { input: input, digit: rule.iban })
            );
        }

        if (this._hasRule('isEqualPositivity')) {
            let rule = this._getRuleByName('isEqualPositivity')
            const isPositive = rule.isEqualPositivity;
            if (isPositive) {
                genRules.push(
                    v => (!v || v > 0 || i18n.t("validation.positivity", { input: input }))
                )
            }
            else {
                genRules.push(
                    v => (!v || v < 0 || i18n.t("validation.negativity", { input: input }))
                )

            }

        }

        if (this._hasRule('notVal')) {
            let rule = this._getRuleByName('notVal');
            genRules.push(
                v => (!v || parseFloat(v) != rule.notVal) || i18n.t("validation.notVal", { input: input, notVal: rule.notVal })
            );

        }

        if (this._hasRule('isRepeatedNumber')) {
            let rule = this._getRuleByName('isRepeatedNumber').isRepeatedNumber;
            genRules.push(
                v => {
                    if (!v) {
                        return true;
                    }
                    if (rule.isRepeatedNumber) {
                        var tmp = {};
                        for (var i = v.length - 1; i >= 0; i--) {
                            var c = v.charAt(i);
                            if (c in tmp) {
                                tmp[c] += 1;
                            }
                            else {
                                tmp[c] = 1;
                            }
                        }
                        var result = {};
                        for (c in tmp) {
                            if (tmp.hasOwnProperty(c)) {
                                if (tmp[c] > 1) {
                                    result[c] = tmp[c];
                                }
                                if (tmp[c] > 9) {
                                    result[c] = tmp[c];
                                    console.log(tmp[c]);
                                    return i18n.t('validation.passwordFreeSeq');
                                }
                            }
                        }
                    }

                    return true;
                }
            );
        }

        if (this._hasRule('custom')) {
            let rule = this._getRuleByName('custom');
            genRules.push(
                v => rule.custom(v)
            );
        }
        // console.log(`genRules`);
        // console.log(genRules);
        return genRules;
    }



}

export default Validation;