function lcs (str1, str2) {
  if (str1.length < 1 || str2.length < 1) return 0
  let first1 = str1.charAt(0)
  let first2 = str2.charAt(0)
  if (first1 === first2) {
    return 1 + lcs(str1.slice(1), str2.slice(1))
  } else {
    let r1 = lcs(str1.slice(1), str2)
    let r2 = lcs(str1, str2.slice(1))
    return Math.max(r1, r2)
  }
}

function lcs2 (str1, str2) {
  let dp = []
  let m = str1.length, n = str2.length
  for (let i = 0; i <= m; i++) {
    dp.push([])
  }
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1.charAt(i) == str2.charAt(j)) {
        dp[i][j] = (dp[i-1][j-1] || 0) + 1
      } else {
        dp[i][j] = Math.max(dp[i-1][j] || 0, dp[i][j-1] || 0)
      }
    }
  }
  console.log(dp[m][n])
}

function lcsWithTime (str1, str2) {
  console.time('lcs')
  console.log(lcs(str1, str2))
  console.timeEnd('lcs')
  console.time('lcs2')
  console.log(lcs2(str1, str2))
  console.timeEnd('lcs2')
}
