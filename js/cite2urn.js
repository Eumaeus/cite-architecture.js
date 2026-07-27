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
			this.isRange = false;
		} else {
			// tests for range
			if (parts[4].includes("-")) {
				this.isRange = true;
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
				this.isRange = true;

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
					this.isRange = false;
				} else {
					if (restricted_chars.test(parts[4])) {
						throw new Cite2UrnError(`Restricted characters ': ; , .' are not allowed in the selector : got "${parts[4]}"`);
					}
					this.selector = parts[4];
					this.subRef = null;
					this.isRange = false;
				}

			}
		} // end if (parts[4]) - Object-component part

		this.urnString = urnString;
		this.collectionComonent = [this.collectionId, this.versionId, this.propertyId];

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


	// -------------------------------------------
	// *** `Cite2Urn` Manipulation
	// -------------------------------------------


	// -------------------------------------------
	// *** `Cite2Urn` Range-specific Manipulation
	// -------------------------------------------


} // end `class Cite2Urn`

















