// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "preencherCampos") {
//         const dados = request.dados;

//         // Função para definir o valor de maneira que frameworks como React consigam capturar
//         function setNativeValue(element, value) {
//             const valueSetter = Object.getOwnPropertyDescriptor(element, 'value')?.set;
//             const prototype = Object.getPrototypeOf(element);
//             const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;

//             if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
//                 prototypeValueSetter.call(element, value);
//             } else if (valueSetter) {
//                 valueSetter.call(element, value);
//             } else {
//                 element.value = value;
//             }

//             element.dispatchEvent(new Event('input', { bubbles: true }));
//             element.dispatchEvent(new Event('change', { bubbles: true }));
//         }

//         // Para cada par chave-valor de dados, procure o campo pelo data-id
//         for (const [dataId, valor] of Object.entries(dados)) {
//             const campo = document.querySelector(`[data-id="${dataId}"]`);
//             if (campo) {
//                 setNativeValue(campo, valor); // Usa a função setNativeValue para definir o valor
//                 campo.dispatchEvent(new Event('blur', { bubbles: true })); // Dispara blur para "confirmar" o valor
//             } else {
//                 console.warn(`Campo com data-id="${dataId}" não encontrado.`);
//             }
//         }
//     }
// });
