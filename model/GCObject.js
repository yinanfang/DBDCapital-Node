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
    const { schema: _, ...otherKeys } = this;
    return otherKeys;
  }
}
