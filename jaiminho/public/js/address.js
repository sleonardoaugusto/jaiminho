frappe.ui.form.on('Address', {
  refresh(frm) {
    frm.events.add_get_address_btn(frm)
  },
  add_get_address_btn(frm) {
    if (!!frm.doc.__unsaved) {
      frm.add_custom_button(('Buscar Endereço'),
        () => frm.events.get_address(frm))
    }
  },
  get_address(frm) {
    frm.events.validate(frm)
    frm.events.get(frm)
  },
  validate(frm) {
    if (!frm.doc.links[0].link_name) {
      frappe.throw('Aponte o cliente na tabela Referência')
    } else if (frm.doc.links[0].link_doctype.toLowerCase() !== 'customer') {
      frappe.throw('O tipo de link na tabela de referência deve ser Cliente')
    }
  },
  get(frm) {
    frappe.show_alert({
      message: 'Buscando endereço...',
      indicator: 'orange'
    })
    frappe.call({
      method: 'jaiminho.jaiminho.api.get_address',
      args: {
        customer_link: frm.doc.links[0].link_name
      },
      callback(r) {
        const data = r.message
        frm.doc.address_line1 = data.address_line1
        frm.doc.county = data.county
        frm.doc.pincode = data.pincode
        frm.doc.city = data.city
        frm.doc.state = data.state
        frm.refresh()
        frappe.show_alert({
          message: 'Operação concluída!',
          indicator: 'green'
        })
      }
    })
  }
})