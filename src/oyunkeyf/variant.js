const variantMap = {
  yuzbir: {
    name: 'Yüzbir',
    id: 1
  },
  yuzbirtest: {
    name: 'Yuzbir Test',
    id: 2
  },
  duzokey: {
    name: 'Düz Okey',
    id: 3
  },
  duzokeytest: {
    name: 'Düz Okey Test',
    id: 4
  },
};

export default function getVariant(key) {
  return variantMap[key];
}
