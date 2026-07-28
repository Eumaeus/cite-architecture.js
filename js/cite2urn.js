/** 
 * --------------------------
 * --- Cite2Urn Class ---------
 *
 * A CITE2 URN is a machine-actionable identifier for 
 * *identification and retrieval of objects in a versioned 
 * * collection of objects that share a defined set of 
 * * properties; the collection may be ordered or unordered.*
 * 
 * This library offers functions for working with CITE2 URNs.
 *
 * --------------------------
**/


/** 
 * --- Define Cite2UrnError ---
**/

class Cite2UrnError extends Error {
  constructor(message) {
    super(message);
    this.name = "Cite2UrnError";
  }
}

/** 
 * --- Cite2Urn Constructor ---
**/

class Cite2Urn {
	constructor(urnString) {
		if (typeof urnString !== "string" || urnString.trim() === "") {
			throw new Cite2UrnError("Cite2Urn must be a non-empty string");
		}

		const restricted_chars = /[-@,:. \t]/i;

		const s = urnString.trim();

		if (!s.toLowerCase().startsWith("urn:cite2:")) {
			throw new Cite2UrnError(`Cite2Urn must start with "urn:cite2:" — got "${s}"`);
		}

		const parts = s.split(":");

		if (parts.length != 5) {
			throw new Cite2UrnError(
			`Cite2Urn must have exactly 5 colon-separated components — got ${parts.length}, "${s}"`
		);
		}

		this.nid = parts[1].toLowerCase();
		this.nss = parts[2];

		// collection-component
		const collCompParts = parts[3].split(".");

		if ((collCompParts.length < 1) || (collCompParts.length > 3)) {
			throw new Cite2UrnError(`There may be 1, 3, or 3 period-delimited parts to the collection-component: got ${collCompParts.length}, "${collCompParts.join('.')}"`);
		}

		if (restricted_chars.test(collCompParts[0])) {
				throw new Cite2UrnError(`Restricted characters '-: ,@.' are not allowed in the collectionId : got "${collCompParts[0]}"`);
		}
		this.collectionId = collCompParts[0];

		if (collCompParts[1]){
			if (restricted_chars.test(collCompParts[1])) {
				throw new Cite2UrnError(`Restricted characters '- : , @ .' are not allowed in the collectionId : got "${collCompParts[1]}"`);
			}
			this.versionId = collCompParts[1];
		} else {
			this.versionId = null;
			this.propertyId = null;
		}

		if (collCompParts[2]){ 
			this.propertyId = collCompParts[2];
			if (restricted_chars.test(collCompParts[2])) {
				throw new Cite2UrnError(`Restricted characters '- : , @ .' are not allowed in the versionId: ${collCompParts[2]}`);
			}
		} else {
			this.propertyId = null;
		}

		// object-component
		if (!parts[4]) {
			this.selector = null;
			this.subRef = null;
			this.objectComponent = "";
		} else {
			// tests for range
			if (parts[4].includes("-")) {
				const splitRange = parts[4].split("-");
				if ( splitRange.length > 2 ) {
					throw new Cite2UrnError(`There may be only one hyphen in the object-component: got "${parts[4]}"`);
				}
				if ( ( splitRange[0] == "" ) || ( splitRange[1] == "" )  ){
					throw new Cite2UrnError(`There may be no leading- or trailing-hyphen in the object-component: got "${parts[4]}"`);
				}
				if (  splitRange[0].includes("@")  ||  splitRange[1].includes("@")  ){
					throw new Cite2UrnError(`Sub-references are not allowed in range-URNs: got "${parts[4]}"`);
				}
				if (restricted_chars.test(splitRange[0])) {
					throw new Cite2UrnError(`Restricted characters ': , @ .' are not allowed in the selector : got "${splitRange[0]}"`);
				}
				if (restricted_chars.test(splitRange[1])) {
					throw new Cite2UrnError(`Restricted characters ': , @ .' are not allowed in the selector : got "${splitRange[1]}"`);
				}

				this.selector = parts[4];
				this.subRef = null;
				this.objectComponent = this.selector;

			} else {

				// Test for sub-ref
				if (parts[4].includes("@")){
					const splitSubRef = parts[4].split("@");
					if (splitSubRef.length > 2) {
							throw new Cite2UrnError(`There may be only one '@' indicating a sub-reference: got "${parts[4]}"`);
					}
					if (restricted_chars.test(splitSubRef[0])) {
						throw new Cite2UrnError(`Restricted characters ': ; , .' are not allowed in the selector : got "${splitsubref[0]}"`);
					}
					if (this.propertyId) {
						throw new Cite2UrnError(`A Cite2Urn identifying a property of an object may not have a sub-reference: got "${urnString}"`);
					}
					this.selector = splitSubRef[0];
					this.subRef = splitSubRef[1];
					this.objectComponent = this.selector + "@" + this.subRef;
				} else {
					if (restricted_chars.test(parts[4])) {
						throw new Cite2UrnError(`Restricted characters ': ; , .' are not allowed in the selector : got "${parts[4]}"`);
					}
					this.selector = parts[4];
					this.subRef = null;
					this.objectComponent = this.selector;
				}

			}
		} // end if (parts[4]) - Object-component part

		this.urnString = urnString;
		this.collectionComponent = [this.collectionId, this.versionId, this.propertyId];

	} // constructor

	// factory constructor
	static fromString(urnString) {
		return new Cite2Urn(urnString);
	}

	// ===========================================
	// *** `Cite2Urn` Methods ********************
	// ===========================================


	// -------------------------------------------
	// *** `Cite2Urn` Assessing Properties
	// -------------------------------------------

	/**
	 * Returns the Cite2Urn.toString property
	 * 
	 * @returns {String}
	 * 
	**/
	toString() {
		return this.urnString;
	}

	/**
	 * Returns `true` if the `this.versionId` property is not `null`.
	 * 
	 * @returns {Boolean}
	**/
	hasVersionId() {
		return (this.versionId != null);
	}

	/**
	 * Returns `true` if the `this.propertyId` property is not `null`.
	 * 
	 * @returns {Boolean}
	**/
	hasPropertyId() {
		return (this.propertyId != null);
	}

	/**
	 * Returns `true` if the `this.selector` property is not `null`.
	 * 
	 * @returns {Boolean}
	**/
	hasSelector() {
		return (this.selector != null);
	}

	/**
	 * Returns `true` if the `this.subRef` property is not `null`.
	 * 
	 * @returns {Boolean}
	**/
	hasSubRef() {
		return (this.subRef != null);
	}

	/**
	 * `Cite2Urn.isRange()` - Returns `true` if the value of the 
	 * `.selector` property contains a hyphen, marking it as a 
	 * `range-selector` and the URN as a range-URN. Returns `false` 
	 * if the value of `this.selector` is `null`. Simply returns 
	 * the CtsUrn.isRange property, set at construction-time.
	 * 
	 * @returns {Boolean}
	**/
	isRange() {
		if (!this.hasSelector()) return false;
		if (this.selector.includes("-")) return true;
		return false;
	}


	// -------------------------------------------
	// *** `Cite2Urn` Comparison
	// -------------------------------------------

	/**
	 * equals(other: Cite2Urn) - Returns `true` if `this.toString() == other.toString()`.  * When comparing a `Cite2Urn` to a `String` with *e.g.* `===` comparison is based on the  * `.urnString` property.
	 * 
	 * @returns {Boolean}
	**/
	equals(other) {
		return (this.toString() == other.toString());
	}

	/** 
   * Intercepts the comparison when compared to a primitive
	**/
  [Symbol.toPrimitive](hint) {
    return this.toString(); 
  }

	/**
	 * nullObject() - Returns `true` if the value of `this.selector` 
	 * is the `String` "null". **N.b.** Returns `false` if the value of 
	 * `this.selector` is the JS *value* `null`. To detect a URN with 
	 * `null` as the value of `.selector`, use `Cite2Urn.hasSelector()`.
	 * 
	 * @returns {Boolean}
	**/
	nullObject() {
		return (this.selector == "null");
	}

	/**
	 * matches(other: Cite2Urn) — Returns `true` if and only if 
	 * `this` identifies a set of objects that includes every object 
	 * identified by `other` (i.e., `other` is “contained by” or 
	 * “more specific than or equal to” `this`), under the hierarchical 
	 * rules (see the API). The test is directional.
	 * 
	 * @param {Cite2Urn} - other
	 * @returns {Boolean}
	**/
	matches(other) {
		if (!(other instanceof Cite2Urn)) {
      throw new Cite2UrnError(`"${other.toString}" is not a valid Cite2Urn.`)
    }

    // Namespaces must match
    if (this.nss != other.nss) return false;

    // this.collectionComponent must be a prefix of other.collectionComponent
    let thisParts = this.collectionComponent.filter( p => p);
    let otherParts = other.collectionComponent.slice(0, thisParts.length);
    if (thisParts.toString() != otherParts.toString()) return false;
    if ( !this.hasSelector() && !other.hasSelector()) return true;

    // Object-Component Rules

    if (this.hasSelector() && !(other.hasSelector())) return false;

    // range stuff
    if ( !(this.isRange()) && other.isRange() ) return false;
    if ( this.isRange() && other.isRange()) {
    		if (this.selector != other.selector) return false;
    }
    if (this.isRange() && !(other.isRange())) {
    	let thisSelectorParts = this.selector.split("-");
    	if ( (other.selector == thisSelectorParts[0]) || (other.selector == thisSelectorParts[1]) ) return true;
    	else return false;
    }

    //neither is a range
    if (this.selector != other.selector) return false;
    if (this.hasSubRef() && !(other.hasSubRef())) return false;
    if (this.subRef != other.subRef) return false;
    
    return true;
	}

	// -------------------------------------------
	// *** `Cite2Urn` Manipulation
	// -------------------------------------------

	/**
	`Cite2Urn.dropVersion()` - Returns a `Cite2Urn` with 
	its `.versionId` property `null`, otherwise identical 
	to `this`. Under the urn-matching rules for `Cite2Urn` 
	objects, the return URN would match `this`, but `this` 
	does not match the return URN. Because a `.propertyId` 
	must be `null` if the `.versionId` is `null`, this 
	also sets `.propertyId` to `null`.

	@returns {Cite2Urn}
	**/
	dropVersion() {
			let newUrnStr = `urn:cite2:${this.nss}:${this.collectionId}:${this.objectComponent}`
			return new Cite2Urn(newUrnStr);
	}

	// -------------------------------------------
	// *** `Cite2Urn` Range-specific Manipulation
	// -------------------------------------------


} // end `class Cite2Urn`

















