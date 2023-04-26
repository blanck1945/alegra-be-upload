const axios = require("axios");

class Axios {
  static baseUrl = "https://co.payana.la";

  static getNitConstraint(companyDoc) {
    return [
      {
        key: "nit_empresa",
        constraint_type: "equals",
        value: companyDoc,
      },
    ];
  }

  static formatUrl(cursor, companyDoc) {
    const query = cursor ? `?cursor=${cursor}` : "";
    const constraintQuery = `${cursor ? "&" : "?"}constraints=${JSON.stringify(
      this.getNitConstraint(companyDoc)
    )}`;

    return {
      query,
      constraintQuery,
    };
  }

  static async executeRequest({ path, companyDoc, cursor = undefined }) {
    const { query, constraintQuery } = this.formatUrl(cursor, companyDoc);

    const url = `${this.baseUrl}${path}${query}${constraintQuery}`;

    return await axios({
      method: "GET",
      url,
      headers: {
        Authorization: `Bearer ${process.env.BUBBLE_TOKEN}`,
      },
    });
  }

  static async executePostRequest({ path, data, headers }) {
    const url = `${this.baseUrl}${path}`;

    return await axios({
      method: "POST",
      url,
      data,
      headers: {
        ...headers,
        Authorization: `Bearer ${process.env.BUBBLE_TOKEN}`,
      },
    });
  }

  static async executePatchRequest({ path, id, fieldsToUpdate }) {
    const url = `${this.baseUrl}${path}/${id}`;
    console.warn(url);

    return await axios({
      method: "PATCH",
      url,
      data: fieldsToUpdate,
      headers: {
        Authorization: `Bearer ${process.env.BUBBLE_TOKEN}`,
      },
    });
  }

  static async executeDeleteRequest({ path, id }) {
    const url = `${this.baseUrl}${path}/${id}`;

    return await axios({
      method: "DELETE",
      url,
      headers: {
        Authorization: `Bearer ${process.env.BUBBLE_TOKEN}`,
      },
    });
  }
}

module.exports = Axios;
