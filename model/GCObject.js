// @flow

import Joi from 'joi-browser';

export default class GCObject {
  schema = Joi.object().keys({
    schema: Joi.object().required(),
  });

  validate() {
    return Joi.validate(this, this.schema);
  }

  simple() {
    // Exclude schema
    const { schema: _, ...otherKeys } = this; // eslint-disable-line no-unused-vars
    return otherKeys;
  }

  static printSimpleArray(array) {
    array.forEach((item) => {
      console.log(item.simple());
    });
  }

  static printSimpleObject(obj) {
    Object.keys(obj).forEach((key) => {
      console.log(obj[key].simple());
    });
  }
}
