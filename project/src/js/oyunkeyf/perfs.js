export const perfTypes = [
  ['yuzbir', '101 Okey', '101'],
  ['duzokey', 'Duz Okey', 'Duz']
];

export default function userPerfs(user) {
  var res = perfTypes.map(p => {
    var perf = user.perfs[p[0]];
    return {
      key: p[0],
      name: p[1],
      perf: perf || '-'
    };
  });

  return res;
}
