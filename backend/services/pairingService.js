function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pairStudentsPreferCrossGender(users) {
  const males = users.filter(u => u.gender === 'male');
  const females = users.filter(u => u.gender === 'female');
  const others = users.filter(u => u.gender === 'other');

  const pairs = [];

  const crossPool = shuffle([...males, ...females]);
  while (crossPool.length >= 2) {
    const a = crossPool.pop();
    let bIdx = crossPool.findIndex(u => u.gender !== a.gender);
    if (bIdx === -1) bIdx = crossPool.length - 1;
    const b = crossPool.splice(bIdx, 1)[0];
    pairs.push([a, b]);
  }

  const leftover = [...crossPool, ...others];
  const shuffledLeftover = shuffle(leftover);
  while (shuffledLeftover.length >= 2) {
    const a = shuffledLeftover.pop();
    const b = shuffledLeftover.pop();
    pairs.push([a, b]);
  }

  return { pairs, unpaired: shuffledLeftover };
}

export function groupStudents(users, size = 4) {
  const shuffled = shuffle(users);
  const groups = [];
  for (let i = 0; i < shuffled.length; i += size) {
    groups.push(shuffled.slice(i, i + size));
  }
  return groups;
}


