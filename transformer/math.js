(function (global, mandox) {
	'use strict';

	if (mandox) {
		eval(uate)('math.js');
	}

	// TODO: Document these functions
	// TODO: Conside using precalculated tables for faster operation:
	// http://svn.apache.org/viewvc/commons/proper/math/trunk/src/main/java/org/apache/commons/math3/util/FastMath.java?view=markup

	function ASSERT(condition, message) {
		if (true !== condition) {
			throw message || 'Assertion failed!';
		}
	}

	/**
	 * A regexp which matches an integer or (optionally signed) floating point
	 * number.
	 *
	 * The match will be placed in group 1.
	 *
	 * Will match +42, and -.42, and +0.4e-2, but not se7en or 0.4.2.
	 *
	 * @param {RegExp}
	 */
	var SIGNED_FLOATING_POINT = /([\-\+]?[0-9]*\.?[0-9]+([eE][\-\+]?[0-9]+)?)/g;

	/**
	 * Rounds a number to the given decimal places.
	 *
	 * @param {number} number
	 * @param {number} digits
	 * @return {number}
	 */
	function round(number, digits) {
		return number.toFixed(digits);
	}

	/**
	 * Convert an argument object into an array.
	 *
	 * @param {arguments} argv
	 * @return {Array.<object>}
	 */
	function args(argv) {
		return Array.prototype.slice.call(argv);
	}

	/** `angles */

	/**
	 * Converts degrees into radians.
	 *
	 * Reference: https://en.wikipedia.org/wiki/Radian
	 *
	 * @param {number} degrees
	 * @return {number}
	 */
	function to_rad(degrees) {
		return degrees * (Math.PI / 180);
	}

	/**
	 * Converts radians to degrees.
	 *
	 * @param {number} radians
	 * @return {number}
	 */
	function to_deg(radians) {
		return radians * (180 / Math.PI);
	}

	/**
	 * Right angle in radians
	 *
	 * @type {number}
	 */
	var RIGHT_ANGLE = to_rad(90);

	/**
	 * 180 degrees in radians
	 *
	 * @type {number}
	 */
	var HALF_ANGLE = to_rad(180);

	/**
	 * 360 degrees in radians
	 *
	 * @type {number}
	 */
	var FULL_ANGLE = to_rad(360);

	/**
	 * Normalizes an angle in a 2 PI radians (360 degrees) wide internal.
	 *
	 * @param {number}
	 * return {number}
	 */
	function normalize_angle(radians) {
		radians %= FULL_ANGLE;
		return (radians < 0) ? FULL_ANGLE + radians : radians;
	}

	/**
	 * Calculates the angle between (0, 0) and (x, y) in radians.
	 *
	 * Reference: https://en.wikipedia.org/wiki/atan2
	 *
	 * atan2(y, x) is the angle in radians between the positive x-axis of a
	 * plane and the point given by the coordinates (x, y) on it. The angle is
	 * positive for counter-clockwise angles (upper half-plane, y > 0), and
	 * negative for clockwise angles (lower half-plane, y < 0).
	 *
	 * @param {array.<number>} vector
	 * @return {number}
	 */
	function angular_direction(vector) {
		return Math.atan2(vector[1], vector[0]);
	}


	/** `scalar */

	/**
	 * Check whether the given object is a scalar.
	 *
	 * @param {object} obj
	 * @return {boolean} True if the object is not and array
	 */
	function is_scalar(obj) {
		return !(
			typeof obj === 'object'
			&&
			typeof obj.length === 'number'
			&&
			typeof obj.propertyIsEnumerable('length')
		);
	}


	/** `vector */

	function v_multiply_scalar(multiplicand, multiplier) {
		var product = [];
		var i;
		for (i = 0; i < multiplicand.length; i++) {
			product[i] = multiplicand[i] * multiplier;
		}
		return product;
	}

	function v_multiply_vector(a, b) {
		throw 'Unimplemented method';
	}

	function v_multiply(vector, multiplier) {
		return (
			is_scalar(multiplier)
				? v_multiply_scalar(vector, multiplier)
				: v_multiply_vector(vector, multiplier)
		);
	}

	/**
	 * Reduces two equal-length vectors to the sum of the products of their
	 * corresponding entries.
	 *
	 * Reference: https://en.wikipedia.org/wiki/Dot_product
	 *
	 * @param {array.<number>} a
	 * @param {array.<number>} b
	 * @return {number}
	 */
	function v_dot_product(a, b) {
		ASSERT(a.length === b.length, v_dot_product);
		var i;
		var len = a.length;
		var sum = 0;
		for (i = 0; i < len; i++) {
			sum += a[i] * b[i];
		}
		return sum;
	}

	/**
	 * Calculate the magnitude of a vector.
	 *
	 * @param {array.<number>} vector
	 * @return {number}
	 */
	function v_magnitude(vector) {
		return Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
	}

	/**
	 * Rotates a vector clockwise by the given radian angle.
	 *
	 * Reference: https://en.wikipedia.org/wiki/Rotation_(mathematics)
	 *
	 * @param {array.<number>} vector
	 * @param {number} angle
	 * @return {number}
	 */
	function v_rotate(vector, angle) {
		var cos = Math.cos(angle);
		var sin = Math.sin(angle);
		return [
			(vector[0] * cos) - (vector[1] * sin),
			(vector[0] * sin) + (vector[1] * cos)
		];
	}

	/**
	 * Adds the given vectors and returns a new copy.
	 *
	 * @param {array.<number>} a
	 * @param {array.<number>} b
	 * @return {array.<number>}
	 */
	function v_add(a, b) {
		return [a[0] + b[0], a[1] + b[1]];
	}

	/**
	 * Subtracts the given vectors and returns a new copy.
	 *
	 * @param {array.<number>} a
	 * @param {array.<number>} b
	 * @return {array.<number>}
	 */
	function v_subtract(a, b) {
		return [a[0] - b[0], a[1] - b[1]];
	}

	/**
	 * Calculates the scalar projection of a vector in a given direction.
	 *
	 * Reference:
	 * https://en.wikipedia.org/wiki/Scalar_projection
	 * s = |a|cos@ = a·^b
	 * · dot product operation
	 * ^b unit vector in direction of b
	 * |a| is the length of a
	 * and @ is the angle between a and b
	 *
	 * @param {array.<number>} vector
	 * @param {array.<number>} direction
	 * @return {number}
	 */
	function v_scalar_projection(vector, direction) {
		var vector_angle = angular_direction(vector);
		var projection_angle = angular_direction(direction);
		return v_magnitude(vector) * Math.cos(vector_angle - projection_angle);
	}

	/**
	 * Reference:
	 * https://en.wikipedia.org/wiki/Vector_projection
	 *
	 * @param {array.<number>} vector
	 * @param {array.<number>} direction
	 * @return {array.<number>}
	 */
	function v_project(vector, direction) {
		return v_multiply(
			direction,
			v_scalar_projection(vector, direction)
		);
	}


	/** `matrix */

	function m_get_row(matrix, index) {
		if (index < 0 || index > matrix.rows) {
			return;
		}
		var row = [];
		var i;
		for (i = index - 1; i < matrix.length; i += matrix.rows) {
			row.push(matrix[i]);
		}
		return row;
	}

	function m_get_col(matrix, index) {
		if (index < 0 || index > matrix.rows) {
			return;
		}
		var start = (index - 1) * matrix.rows;
		return matrix.slice(start, start + matrix.rows);
	}

	function m_get_rows(matrix) {
		var rows = [];
		var i;
		for (i = 0; i < matrix.rows; i++) {
			rows[i] = [];
		}
		for (i = 0; i < matrix.length; i++) {
			rows[i % matrix.rows].push(matrix[i]);
		}
		return rows;
	}

	function m_to_string(pretty_print) {
		if (!pretty_print) {
			return this.join(',');
		}
		var rows = m_get_rows(this);
		var str = [];
		var i;
		for (i = 0; i < rows.length; i++) {
			str.push('| ' + rows[i].join('  ') + ' |');
		}
		return str.join('\n');
	}

	function m_is_multiplication_compatible(a, b) {
		return a.cols === b.rows;
	}

	/**
	 * Matrices are respresented in column-order.
	 *
	 * Therefore the matrix:
	 *
	 * [ a b tx ]
	 * [ c d ty ]
	 *
	 * will be stored contiguously as the array sequence: [ a c  b d  tx ty ]
	 *
	 * References:
	 * https://en.wikipedia.org/wiki/Column-major_order#Column-major_order):
	 */
	function m_matrix() {
		var rows = args(arguments);
		var m = [];

		m.rows = rows.length;
		m.cols = m.rows ? rows[0].length : 0;

		var col, row;
		for (col = 0; col < m.cols; col++) {
			for (row = 0; row < m.rows; row++) {
				m.push(rows[row][col]);
			}
		}

		m.toString = m_to_string;

		return m;
	}

	/**
	 * You can multiply two matrices if, and only if, the number of columns in
	 * the first matrix equals the number of rows in the second matrix.
	 *
	 * Otherwise, the product of two matrices is undefined.
	 *
	 * NB: A<n×m> · B<m×p> = C<n×p>
	 *
	 * Reference:
	 * https://en.wikipedia.org/wiki/Matrix_multiplication#Matrix_product_.28two_matrices.29
	 *
	 * @param {array.<number>} a
	 * @param {array.<number>} b
	 * return {array.<number>}
	 */
	function m_multiply_matrix(a, b) {
		ASSERT(m_is_multiplication_compatible(a, b), m_multiply_matrix);
		var result = [];
		var row;
		var col;
		for (row = 1; row <= a.rows; row++) {
			var entries = [];
			for (col = 1; col <= b.cols; col++) {
				entries.push(v_dot_product(
					m_get_row(a, row),
					m_get_col(b, col)
				));
			}
			result.push(entries);
		}
		return m_matrix.apply(null, result);
	}

	/**
	 * Computes the product of multiplying a matrix with another matrix, a
	 * vector or a scalar multiplier.
	 *
	 * M × {M|V|S}
	 *
	 * @param {array.<number>} matrix
	 * @param {number|array.<number>} multiplier
	 * @return {array.<number>}
	 */
	function m_multiply(matrix, multiplier) {
		return (
			is_scalar(multiplier)
				? v_multiply_scalar(matrix, multiplier)
				: m_multiply_matrix(matrix, multiplier)
		);
	}

	/**
	 * Rotates a 3×3 or 2×2 matrix by the given angle.
	 *
	 * Rotating be any matrix with a dimension greater than 3 is undefined.
	 *
	 * References:
	 * https://en.wikipedia.org/wiki/Matrix_rotation
	 *
	 * @param {array.<number>} matrix
	 * @param {number} rotation
	 * @return {array.<number>}
	 */
	function m_rotate(matrix, rotation) {
		var cos = Math.cos(rotation);
		var sin = Math.sin(rotation);
		return (2 === matrix.cols)
			? m_multiply(matrix, m_matrix(
				[cos, -sin],
				[sin,  cos]
			))
			: m_multiply(matrix, m_matrix(
				[cos, -sin, 0],
				[sin,  cos, 0],
				[0,    0,   1]
			));
	}

	function m_translate(matrix, translation) {
		return (2 === matrix.cols)
			? m_multiply(matrix, m_matrix(
				[1, 0, translation[0]],
				[0, 1, translation[1]]
			))
			: m_multiply(matrix, m_matrix(
				[1, 0, translation[0]],
				[0, 1, translation[1]],
				[0, 0, 1             ]
			));
	}

	function m_scale(matrix, scale) {
		return (2 === matrix.cols)
			? m_multiply(matrix, m_matrix(
				[scale[0], 0,        0],
				[0,        scale[1], 0]
			))
			: m_multiply(matrix, m_matrix(
				[scale[0], 0,        0],
				[0,        scale[1], 0],
				[0,        0,        1]
			));
	}

	function m_skew(matrix, skew) {
		return (2 === matrix.cols)
			? m_multiply(matrix, m_matrix(
				[0,                 Math.tan(skew[0]), 0],
				[Math.tan(skew[0]), 1,                 0]
			))
			: m_multiply(matrix, m_matrix(
				[0,                 Math.tan(skew[0]), 0],
				[Math.tan(skew[0]), 1,                 0],
				[0,                 0,                 1]
			));
	}

	global.MathUtil = {

		// util
		SIGNED_FLOATING_POINT: SIGNED_FLOATING_POINT,

		// angle
		FULL_ANGLE        : FULL_ANGLE,
		HALF_ANGLE        : HALF_ANGLE,
		RIGHT_ANGLE       : RIGHT_ANGLE,
		angular_direction : angular_direction,
		normalize_angle   : normalize_angle,
		to_deg            : to_deg,
		to_rad            : to_rad,

		// scalar
		round : round,

		// vector
		v_dot_product       : v_dot_product,
		v_magnitude         : v_magnitude,
		v_multiply          : v_multiply,
		v_project           : v_project,
		v_rotate            : v_rotate,
		v_scalar_projection : v_scalar_projection,
		v_add               : v_add,
		v_subtract          : v_subtract,

		// matrix
		matrix      : m_matrix,
		m_multiply  : m_multiply,
		m_rotate    : m_rotate,
		m_translate : m_translate,
		m_scale     : m_scale,
		m_skew      : m_skew,
		m_get_row   : m_get_row,
		m_get_col   : m_get_col

	};

}(this, this.mandox));
