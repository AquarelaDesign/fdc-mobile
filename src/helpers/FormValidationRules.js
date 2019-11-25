export default function validate(values) {
  let errors = {}
  
  if (!values.email) {
    errors.email = 'Email é obrigatório'
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email inválido'
  }

  if (!/^1000([.][0]{1,3})?$|^\d{1,3}$|^\d{1,3}([.]\d{1,3})$|^([.]\d{1,3})$/.test(values.km)) {
    errors.km = 'Km possui um formato inválido'
  }

  if (!/^1000([.][0]{1,2})?$|^\d{1,2}$|^\d{1,2}([.]\d{1,2})$|^([.]\d{1,2})$/.test(values.quant)) {
    errors.quant = 'Quantidade possui um formato inválido'
  }

  if (!/^1000([.][0]{1,2})?$|^\d{1,2}$|^\d{1,2}([.]\d{1,2})$|^([.]\d{1,2})$/.test(values.valor)) {
    errors.valor = 'Valor possui um formato inválido'
  }

  return errors
}