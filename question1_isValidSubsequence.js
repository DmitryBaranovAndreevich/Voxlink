function isValidSubsequence(array, sequence) {
    let first = 0;
    let second = 0;
  
    if (array.length < sequence.length || sequence.length === 0) return false;
  
    while (first < array.length && second < sequence.length) {
   
      const firstArrElement = array[first];
      const secondArrayElement = sequence[second];
  
      if (firstArrElement === secondArrayElement) second += 1;
  
      first += 1;
    }
  
    return second === sequence.length;
  }

module.exports = {
  isValidSubsequence,
};
