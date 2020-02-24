# -*- coding: utf-8 -*-
# Copyright (c) 2018, laugusto and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe

import json
import requests


@frappe.whitelist()
def get_address(customer_link):
    customer = frappe.get_doc('Customer', customer_link)
    tax_id = clear_tax_id(customer.tax_id)

    base_url = 'https://www.receitaws.com.br/v1/cnpj/'
    url = '{}{}'.format(base_url, tax_id)

    r = requests.get(url)
    validate(r)
    address = get_data(r)
    return address


def clear_tax_id(tax_id):
    return tax_id.replace('.', '').replace('/', '').replace('-', '')


def validate(req):
    check_status(req)


def check_status(req):
    error = 'ERROR'
    if req.status_code == 429:
        message = 'Muitas consultas, tente novamente mais tarde'
        frappe.throw('Ocorreu um erro: {}'.format(message))
    if req.json().get('status') == error:
        message = req.json().get('message')
        frappe.throw('Ocorreu um erro: {}'.format(message))


def get_data(req):
    data = req.json()
    address = dict(
        address_line1='{}, {}'.format(data.get('logradouro'), data.get('numero')),
        county=data.get('bairro'),
        pincode=data.get('cep'),
        city=data.get('municipio'),
        state=data.get('uf')
    )
    return address
