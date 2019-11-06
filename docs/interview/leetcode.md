# leetcode 各种题

##  双指针
88.合并两个有序数组

给定两个有序整数数组 nums1 和 nums2，将 nums2 合并到 nums1 中，使得 num1 成为一个有序数组。

说明:

初始化 nums1 和 nums2 的元素数量分别为 m 和 n。
你可以假设 nums1 有足够的空间（空间大小大于或等于 m + n）来保存 nums2 中的元素。
示例:

输入:
nums1 = [1,2,3,0,0,0], m = 3
nums2 = [2,5,6],       n = 3

输出: [1,2,2,3,5,6]

```js
/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
var merge = function(nums1, m, nums2, n) {
    let len1 = m - 1;
    let len2 = n - 1;
    let len = m + n - 1;
    while(len1 >= 0 && len2 >= 0) {
        // 注意--符号在后面，表示先进行计算再减1，这种缩写缩短了代码
        nums1[len--] = nums1[len1] > nums2[len2] ? nums1[len1--] : nums2[len2--];
    }
    function arrayCopy(src, srcIndex, dest, destIndex, length) {
        dest.splice(destIndex, length, ...src.slice(srcIndex, srcIndex + length));
    }
    // 表示将nums2数组从下标0位置开始，拷贝到nums1数组中，从下标0位置开始，长度为len2+1
    arrayCopy(nums2, 0, nums1, 0, len2 + 1);
};
```