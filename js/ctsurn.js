/** 
 * --------------------------
 * --- CtsUrn Class ---------
 *
 *   CTS URNs have 5 components:
 *   urn:cts:<namespace>:<bibliography-component>:<passage-component>
 *
 *   <bibliography-component> captures the *bibliographic hierarchy*
 *   in period-separated fields.
 *
 *   <passage-component> captures the *passage-hierarchy*
 *   in period-separated fields. It may express a *range*
 *   from passage to another with two period-separated passeges
 *   separated by a hyphen.
 *
 *   NOTE: The values in the <passage-component> are *labels* not
 *   *integers*, although integers are often used as labels. E.g.
 *   "Iliad 1.1", but also "Euclid, Elements, 1 Postulate 1" 
 *   or "Aristpohanes Frogs 1153a".
 *
 * --------------------------
**/


/** 
 * --- Define CtsUrnError ---
**/

class CtsUrnError extends Error {
  constructor(message) {
    super(message);
    this.name = "CtsUrnError";
  }
}

/** 
 * --- CtsUrn Constructor ---
**/

class CtsUrn {
	constructor(urnString) {
		if (typeof urnString !== "string" || urnString.trim() === "") {
			throw new CtsUrnError("CTS URN must be a non-empty string");
		}

		const s = urnString.trim();

		if (!s.toLowerCase().startsWith("urn:cts:")) {
			throw new CtsUrnError(`CTS URN must start with "urn:cts:" — got "${s}"`);
		}

		const parts = s.split(":");

		if (parts.length < 4 || parts.length > 5) {
			throw new CtsUrnError(
			`CTS URN must have exactly 4 or 5 colon-separated components — got "${s}"`
		);
		}

		if (parts.length == 4 && urnString.at(-1) != ":") {
			throw new CtsUrnError(
			`A CTS URN without a passage-component must be terminated by a colon: "${s}"`
		);
		}

		this.nid = parts[1].toLowerCase();
		this.nss = parts[2];

		// Bibliographic component (1–4 dot-separated parts)
		const bibParts = parts[3].split(".");
		if (bibParts.length < 1 || bibParts.length > 4) {
			throw new CtsUrnError(`Bibliographic component must have 1–4 dot-separated parts — got "${parts[3]}"` );
		} 

		this.textgroup = bibParts[0];
		this.workid = bibParts[1] || undefined;
		this.version = bibParts[2] || undefined;
		this.exemplar = bibParts[3] || undefined;

		// Passage component (optional)
		let passagePart = parts.length === 5 ? parts[4] : "";
		// Passage validity
		if (passagePart != "") {
			const psgmatch = passagePart.match(/^(([A-Za-z0-9]+)(\.[A-Za-z0-9]+)*(-([A-Za-z0-9]+)(\.[A-Za-z0-9]+)*)?)$/i);
		  if (!psgmatch) {
		    throw new CtsUrnError(`Invalid passage format: "${passagePart}"`);
		  }
		}

		this.passage = passagePart === "" ? undefined : passagePart;

		// Canonical string
		this.urnstring = s;

		// Bibliographic hierarchy as array
		this.bibliocomponent = [this.textgroup];
		if (this.workid) this.bibliocomponent.push(this.workid);
		if (this.version) this.bibliocomponent.push(this.version);
		if (this.exemplar) this.bibliocomponent.push(this.exemplar);
	} // constructor

	// static factory function
  static fromString(cexstring) {
  	return new CtsUrn(cexstring);
  }


	/** 
	 * ----------------------------------
   * --- URN Classification -----------
	/** 

  /** 
	 * Returns true if a CtsUrn has a passage-component
	 * 
	 * @returns {Boolean} 
	**/
	hasPassage() {
		if (this.passage) return true;
		return false;
	}		

  /** 
	 * Does the URN identify a range of passages?
	 * 
	 * @returns {Boolean} 
 	**/
	isRange() {
		if (!this.passage) return false;
		return this.passage.includes('-');
	}

  /** 
	 * Does the URN cite a text at the textgroup-level (only!)
	 * 
	 * @returns {Boolean} 
	**/
	isTextGroupUrn() {
		if (!this.workid) {
			return true;
		} else {
			return false;
		}
	}

  /** 
	 * Does the URN cite a text at the work-level (only!)
	 * 
	 * @returns {Boolean} 
	**/
	isWorkUrn() {
		if (!this.version) {
			return true;
		} else {
			return false;
		}
	}

  /** 
	 * Does the URN cite a text at the version-level (only!)
	 * 
	 * @returns {Boolean} 
	**/
	isVersionUrn() {
		if (this.version && !this.exemplar) {
			return true;
		} else {
			return false;
		}
	}

	  /** 
	 * Does the URN cite a text at the exemplar-level (only!)
	 * 
	 * @returns {Boolean} 
	**/
	isExemplarUrn() {
		if (this.exemplar) {
			return true;
		} else {
			return false;
		}
	}

  /** 
	 * Returns the number of fields in the citation-component of a non-range CtsUrn
	 * 
	 * @returns {Int}
	**/
	passageDepth() {
		if (this.isRange()) {
			throw new CtsUrnError(`'.passageDepth()' does not work on ranges. Use '.rangeDepth()'. ${this.toString()}`);
		}
		let psg = this.passage
		return psg.split(".").length;
	}

  /** 
	 * Returns a two-element array of the number of fields in each side of a the citation-component of a range CtsUrn
	 * 
	 * @returns [{Int}]
	**/
	rangeDepth() {
		if (!this.isRange()) {
			throw new CtsUrnError(`'.rangeDepth()' only works on ranges. Use '.passageDepth()'. ${this.toString()}`);
		}
		let splitted = this.splitRange();
		let s = splitted[0].passageDepth();
		let e = splitted[1].passageDepth();
		return [s, e];
	}

	/**
	 * -----------------------
   * --- URN Comparison ----
  **/

  /** 
   * Redefine equality to be string-based.
	**/
  equals(other) {
  	return this.toString() == other.toString();
  }

  /** 
   * Intercepts the comparison when compared to a primitive
	**/
  [Symbol.toPrimitive](hint) {
    return this.toString(); 
  }

  /** 
	 * Takes another CtsUrn and returns "true" if they are equal to the version-level
	 * 
	 * @param {CtsUrn} other - a CtsUrn at the version- or exemplar-level
	 * @returns {Boolean} 
	**/
	versionEquals(other) {
		if (this.isWorkUrn()) {
			return false;
		}
		if (other.isWorkUrn()) {
			return false;
		}
		let vu1 = this.versionLevelUrn();
		let vu2 = other.versionLevelUrn();

		return vu1.equals(vu2);
	}

  /** 
	 * Helper function for areCongruent(other) and passageIncludes().
	 * Takes two strings representing passage-components of a CtsUrn.
	 * Checks their validity.
	 * Returns `true` if each period-separated part that is present in both is equal. 
	 * If the `s1` string has fewer parts, it "includes" string `s2` 
	 * if the parts of `s1` match the corresponding initial parts of `s2`.
	 * If `directed == true`, then we check to see if s1 "includes" s2. 
	 * Otherwise we check for "congruity".
	 * 
	 * @param {String} - s1
	 * @param {String} - s2
	**/
	passageStrIncludes(s1, s2, directed = false){

		if (directed) {
			if (!s1 && s2){ 
				return true;
			}
			if (s1 && !s2){ 
				return false;
			}
		}

		let pass1 = s1.split(".");
		let pass2 = s2.split(".");

		if (directed) {
			if (pass1.length > pass2.length) { 
				return false;
			}
		}

		let minPass = Math.min(pass1.length, pass2.length);
		let mpass1 = pass1.slice(0, minPass);
		let mpass2 = pass2.slice(0, minPass);
		if (mpass1.join(".") != mpass2.join(".")) { 
			return false;
		}
		return true; 
	}

  /** 
	 * Two CtsUrns are "congruent" if both can be said to identify *the same thing*.
	 * Either of the two might identify *other things as well*.
	 * Two CTS URNs are congruent if: 
	 * 1.  They have the same namespace. 
	 * 2.  For their work components, each period-separated part that is present in both is equal. If one URN has fewer work parts, it's congruent if its parts match the corresponding initial parts of the other. 
	 * 3.  For their passage components (if not ranges), the same logic as for work components applies to their period-separated parts. 
	 * 4.  They must both be ranges or both not be ranges.
	 * 5.  If both are ranges, their start passage parts must be congruent, and their end passage parts must be congruent. 
	 * 
	 *@param {CtsUrn} - other
	 *@returns {Boolean}
	**/
	areCongruent(other, directed = false) {
		// Bibliography Parts
		if (this.nss != other.nss) return false;
		let thisBib = this.bibliocomponent;
		let otherBib = other.bibliocomponent;
		let minBib = Math.min(thisBib.length, otherBib.length);
		if (directed) {
			if (thisBib.length > otherBib.length) { 
				return false;
			}
		}
		let sb = thisBib.slice(0, minBib);
		let so = otherBib.slice(0, minBib);
		if (sb.join(".") != so.join(".")){ 
			return false;
		}

		// --- Passage Parts

		// One without passage, other with passage
		if (this.passage && !(other.passage)) {
			if (directed) return false;
		}
		if (!this.passage && other.passage) {
			if (directed) return true;
		}

		// Two Ranges
		if (this.isRange() && other.isRange()) {
			// 5.  If both are ranges, their start passage parts must be congruent, and their end passage parts must be congruent. 
			let tra = this.splitRange();
			let ora = other.splitRange();

			// reduce each passage…
			let tra0parts = tra[0].passage.split(".");
			let tra1parts = tra[1].passage.split(".");
			let ora0parts = ora[0].passage.split(".");
			let ora1parts = ora[1].passage.split(".");

			// Quickies
			if (directed) {
				if (tra0parts.length > ora0parts.length){ 
					return false;
				}	
				if (tra1parts.length > ora1parts.length) { 
					return false;
				}
			}

			let min0 = Math.min(tra0parts.length, ora0parts.length);
			let min1 = Math.min(tra1parts.length, ora1parts.length);

			let slicedThis0 = tra0parts.slice(0, min0);
			let slicedOther0 = ora0parts.slice(0, min0);
			let slicedThis1 = tra1parts.slice(0, min1);
			let slicedOther1 = ora1parts.slice(0, min1);

			let newThis0 = tra[0].addPassage(slicedThis0.join("."));
			let newThis1 = tra[1].addPassage(slicedThis1.join("."));
			let newOther0 = tra[0].addPassage(slicedOther0.join("."));
			let newOther1 = tra[1].addPassage(slicedOther1.join("."));
			if ( !(newThis0.areCongruent(newOther0, directed) && newThis1.areCongruent(newOther1, directed)) ){ 
				return false;
			}

		} // Two Ranges

		// Two Passages
		if ((!this.isRange() && this.passage) && (!other.isRange() && other.passage)) {
			if (!this.passageStrIncludes(this.passage, other.passage, directed)) {
				return false;
			}
		} // Two Passages

		// One Range, One Passage
		if ( (this.isRange() && !other.isRange()) || (!this.isRange() && other.isRange()) ){
			let tempThis = this;
			let tempOther = other;
			let fakeRangePassage = "";
			if (!this.isRange()){
				fakeRangePassage = this.passage + "-" + this.passage;
				tempThis = this.addPassage(fakeRangePassage);
			}
			if (!other.isRange()){
				fakeRangePassage = other.passage + "-" + other.passage;
				tempOther = this.addPassage(fakeRangePassage);
			}
			return tempThis.areCongruent(tempOther, directed);
		} 
		/*
		if (this.isRange() && !other.isRange() && other.passage ) {
			// Crazy… make `this` a range, from itself to itself, and try again.
			let fakeRangePassage = other.passage + "-" + other.passage;
			let fakeOther = other.addPassage(fakeRangePassage);
			return this.areCongruent(fakeOther, directed);
		}
		*/

		return true;
	}

  /** 
	 * Like `CtsUrn.areCongruent(), but directed.`
	 * "Iliad" is congruent with "Iliad, Allen ed.", but the reverse is not true.
	 * "Iliad 1" is congruent with "Iliad 1.1", but the reverse is not true
	 * 
	 *@param {CtsUrn} - other
	 *@returns {Boolean}
	**/
	isCongruentWith(other) {
		return this.areCongruent(other, true);	
	}

  /** 
	 * Takes another CtsUrn and returns "true" if 
	 * (a) the bibliographic hierarchy of `this` matches that of the second, 
	 * and (b) passage-component of `this` "includes" the passage of `other`. 
	 * 
	 * @param {CtsUrn} other -
	 * @returns {Boolean} 
	**/
	passageIncludes(other) {
		if ( !this.biblMatches(other)) {
			if (!this.isRange()){
				return false;
			} else { // it is a range
				if ( !this.splitRange()[0].biblMatches(other) && !this.splitRange()[1].biblMatches(other) ) {
					return false;
				}
			}
		} else {
			if (this.isRange()){
				let u1 = this.splitRange()[0];
				let u2 = this.splitRange()[1];
				if ( u1.passageStrIncludes(u1.passage, other.passage, true) || ( u1.passageStrIncludes(u2.passage, other.passage, true) ) ) {
					return true;
				} else {
					return false;
				}
			} else {
				if (this.passageStrIncludes(this.passage, other.passage, true)) return true;	
			}
		}
		return false;
	}

  /** 
	 * A synonym for `passageIncludes()`, added here for historical consistency. 
	 * 
	 * @param {CtsUrn} other -
	 * @returns {Boolean} 
	**/
	passageContains(other) {
		return this.passageIncludes(other);
	}

  /** 
	 * Return `true` if the bibliographic-component of `this` exactly
	 * matches that of `other`.
	 * 
	 * @param {CtsUrn} - other
	 * @returns{Boolean}
	**/
	biblMatches(other) {
		if (this.bibliocomponent.toString() == other.bibliocomponent.toString()) return true;
		return false;
	}


	/**
	 * ---------------------
	 * --- URN Retrieval ---
	**/

  /** 
   * Returns a String serialization of the CtsUrn
  **/
	toString() {
		return `${this.urnstring}`;
	}

  /** 
	 * Returns the {String} of a passage-component
	 * 
	 * @returns {String} 
	**/
	getPassage() {
		if (this.passage) return this.passage;
		return "";
	}

	/**
	 * -------------------------
   * --- URN-Manipulations ---
  **/

  /** 
	 * Removes the passage-component from a URN and returns a new URN
	 * 
	 * @returns {CtsUrn} 
	**/
  dropPassage() {
		let components = this.urnstring.split(":").slice(0,4);
		let newUrnString = components.join(':') + ':';
		let newUrn = new CtsUrn(newUrnString)
		return newUrn;
  }

  /** 
	 * Replaces the passage-component of a CtsUrn with another
	 * 
	 * @param {String} newPassage - a string representing the new passage (may be a range)
	 * @returns {CtsUrn} 
	**/
	replacePassage(newPassage) {
		let newUrnStr = this.dropPassage().toString();
		let newUrn = new CtsUrn(newUrnStr + newPassage);
		return newUrn;
	}

  /** 
	 * Takes a range-urn and returns a Vector{CtsUrn}
	 * identifying the first- and last-citations of the range
	 * 
	 * @returns Vector{CtsUrn} 
	**/
	splitRange() {
		if (!this.isRange()) {
	    throw new CtsUrnError(`Not a range-urn: "${this}"`);
	  } else {
	  	var wholeRange = this.passage;
	  	var startPassage = wholeRange.split('-')[0];
	  	var endPassage = wholeRange.split('-')[1];
	  	let urn1 = this.replacePassage(startPassage);
	  	let urn2 = this.replacePassage(endPassage);
	  	return [urn1, urn2];
	  }
	}

  /** 
	 * Takes a range-urn and returns a CtsUrn pointing to the start of the range
	 * 
	 * @returns {CtsUrn} 
	**/
	rangeFrom() {
		return this.splitRange()[0];
	}

  /** 
	 * Takes a range-urn and returns a CtsUrn pointing to the start of the range.
	 * Included here because older libraries used it.
	 * 
	 * @returns {CtsUrn} 
	**/
	rangeStart() {
		return this.rangeFrom();
	}

  /** 
	 * Takes a range-urn and returns a CtsUrn pointing to the end of the range
	 * 
	 * @returns {CtsUrn} 
	**/
	rangeTo() {
		return this.splitRange()[1];
	}

  /** 
	 * Takes a range-urn and returns a CtsUrn pointing to the end of the range.
	 * Included here because older libraries used it.
	 * 
	 * @returns {CtsUrn} 
	**/
	rangeEnd() {
		return this.rangeTo();
	}

  /** 
	 * Takes two CtsUrns and constructs a range-urn from `this` to `other`.
	 * In the case of ranges, take the start of `this` and the end of `other`.
	 * 
	 *@param {CtsUrn} - other
	 *@returns {CtsUrn}
	**/
	makeRange(other) {
		if (!this.passage) {
	    throw new CtsUrnError(`.makeRange(): Urn does not have passage-component: "${this}"`);
	  }			
	  if (!other.passage) {
	    throw new CtsUrnError(`.makeRange(): Urn does not have passage-component: "${other}"`);
	  }	
		let startUrn = this
		if (this.isRange()) {
			startUrn = this.splitRange()[0];
		}
		let endUrn = other
		if (other.isRange()) {
			endUrn = other.splitRange()[1];
		}
		let startPsg = startUrn.passage;
		let endPsg = endUrn.passage;
		let base = this.dropPassage().toString();
		return new CtsUrn(base + startPsg + "-" + endPsg);
	}

  /** 
	 * Takes a CtsUrn and returns a CtsUrn identifying only the version-level. 
	 * (Drops passage!)
	 * 
	 * @returns {CtsUrn} 
	**/
	versionLevelUrn() {
		let parts = this.toString().split(':');		
		let bib = parts[3];
		let bibParts = bib.split('.');
		if (bibParts.length < 3) {
			throw new CtsUrnError(`URN is only at the work level. No version: "${this}"`);
		} else {
			let newBib = bibParts.slice(0, 3).join('.');
			parts[3] = newBib;
			let newParts = parts.slice(0, 4).join(":") + ":";
			return new CtsUrn(newParts);
		}
	}

  /** 
	 * Takes a CtsUrn and returns a CtsUrn identifying only the work-level.
	 * (Drops passage!)
	 * 
	 * @returns {CtsUrn} 
	**/
	workLevelUrn() {
		let parts = this.toString().split(':');		
		let bib = parts[3];
		let bibParts = bib.split('.');
		if (bibParts.length < 2) {
			throw new CtsUrnError(`URN is only at the group level. No work, version, or exemplar: "${urn}"`);
		} else {
			let newBib = bibParts.slice(0, 2).join('.');
			parts[3] = newBib;
			let newParts = parts.slice(0, 4).join(":") + ":";
			return new CtsUrn(newParts);
		}
	}

  /** 
	 * Given an exemplar-level CtsUrn, remove the exemplar-component of the URN, leaving everything else the same.
	 * 
	 * @returns {CtsUrn}
	**/
	versionFromExemplar() {
		if (this.isWorkUrn()) {
	    throw new CtsUrnError(`Must be at least a version-level URN: "${this}"`);
		} else {
			let urnarray = ["urn", this.nid, this.nss];	
			let bib = [this.textgroup, this.workid, this.version].join(".");
			urnarray.push(bib, this.passage);
			let urnstr = urnarray.join(":")
			return new CtsUrn(urnstr);
		}
	}

  /** 
	 * Adds the String `exemplarId` to a version-level URN, leaving everything else unchanged.
	 * If there is an existing exemplar id, replaces it.
	 * 
	 * @param {String} - exemplarId
	 * @returns {CtsUrn}
	**/
	addExemplar(exemplarId) {
		if (this.isWorkUrn()) {
	    throw new CtsUrnError(`Must be at least a version-level URN: "${this}"`);
		} else {
			let urnarray = ["urn", this.nid, this.nss];	
			let bib = [this.textgroup, this.workid, this.version, exemplarId].join(".");
			urnarray.push(bib, this.passage);
			let urnstr = urnarray.join(":")
			return new CtsUrn(urnstr);
		}
	}

  /** 
	 * Adds a passage-component to a CTS-URN.
	 * If there is already one, replaces it.
	 * 
	 * @param {String} - psgString
	**/
	addPassage(psgString) {
		// check validity of psgString up front, so we can get a more precise error message.
		const psgmatch = psgString.match(/^(([A-Za-z0-9]+)(\.[A-Za-z0-9]+)*(-([A-Za-z0-9]+)(\.[A-Za-z0-9]+)*)?)$/i);
    if (!psgmatch) {
      throw new CtsUrnError(`Invalid passage format: "${psgString}"`);
    }

    let nopass = this.dropPassage();
    let newUrnStr = nopass.toString() + psgString;
    return new CtsUrn(newUrnStr);
	}

  /** 
	 * Reduce the passage-hierarchy of the CtsUrn by one level.
	 * Works only on single passages, not ranges. 
	 * If there is no passage, just returns the URN.
	 * 
	 *@returns {CtsUrn}
	**/
	chopPassage() {
		if (this.isRange()) {
			throw new CtsUrnError(`'.chopPassage()' does not work on ranges. ${this.toString()}`);
		}
		if (!this.passage) {
			return this;
		}
		let currentDepth = this.passageDepth();
		if (currentDepth < 2) {
			return this.dropPassage();
		}
		let noPassage = this.dropPassage();
		let parts = this.passage.split(".");
		let newPsg = parts.slice(0, parts.length-1).join(".");
		return new CtsUrn(noPassage.toString() + newPsg);
	}

  /** 
	 *Extend the passage-hierarchy of the CtsUrn by one level, adding `citeString` as the value for the new level.
	 * Error if `this` is a range-urn.
	 * 
	 *@param {String} - citeString
	 *@returns CtsUrn
	**/
	extendPassage(citeString) {
		if (this.isRange()) {
			throw new CtsUrnError(`'.extendPassage()' does not work on ranges. ${this.toString()}`);
		}
		let baseStr = this.dropPassage().toString();
		let psgStr = ""
		if (!this.passage) {
			psgStr = citeString; 
		} else {
			psgStr = this.passage + "." + citeString;
		}
		return new CtsUrn(baseStr + psgStr);
	}

  /** 
	 * Helper function for .passageToDepth().
	 * 
	 * @param {String} - psg
	 * @param {Int} - depth
	 * @returns {String}
	**/
	psgStringDepth(psg, depth) {
		if (depth < 1) {
			throw new CtsUrnError(`Depth 0 is invalid. Use 'this.dropPassage()'.`);
		}
		if (psg == "") {
			throw new CtsUrnError(`No passage-string supplied.`);
		}
		let pArray = psg.split(".");
		if (pArray.length < depth) {
			throw new CtsUrnError(`'${psg}' has a depth ${pArray.length}, which is less than the requested ${depth}.`)
		}
		return pArray.slice(0, depth).join(".");
	}

  /** 
	 * Chops the citation-hierarchy until it is `level`-levels deep.
	 * Error if `level` is greater than the current citation-level.
	 * 
	 * @param {Int} - depth
	 * @returns {CtsUrn}
	**/
	passageToDepth(depth) {
		if (depth < 1) {
			throw new CtsUrnError(`Depth 0 is invalid. Use 'this.dropPassage()'.`);
		}

		if (!this.passage) {
			throw new CtsUrnError(`URN has no passage-component. ${this.toString()}`);
		}
		if (this.isRange()) {
			let currentDepthArr = this.rangeDepth();
			if ( currentDepthArr[0] < depth ) {
				throw new CtsUrnError(`The start of this range is has a depth (${currentDepthArr[0]}) less than the requested depth (${depth}). ${this.toString()}`);
			}
			if ( currentDepthArr[1] < depth ) {
				throw new CtsUrnError(`The end of this range is has a depth (${currentDepthArr[1]}) less than the requested depth (${depth}). ${this.toString()}`);
			}
			let u1 = currentDepthArr[0];
			let u2 = currentDepthArr[1];
			let p1 = this.splitRange()[0].passage;
			let p2 = this.splitRange()[1].passage;
			let p1a = this.psgStringDepth(p1, depth);
			let p2a = this.psgStringDepth(p2, depth);
			let base = this.dropPassage().toString();
			return new CtsUrn(base + p1a + "-" + p2a);
		} else {
			let currentDepth = this.passageDepth();
			let newCitation = this.psgStringDepth(this.passage, depth);
			let base = this.dropPassage().toString();
			return new CtsUrn(base + newCitation);
		}
		return null;
	}

  /** 
	 * Chop the citation-level of whichever URN has a deeper citation-hiearchy so that both are at the same level. Disregards the bibliography-component altogether.
	 * In the unlikely event that anyone will ever use this on a pair that
	 * includes one or two range-urns, it will equalize to the lowest 
	 * depth of any of the passages identified.
	 * 
	 * @param {CtsUrn} - other
	 * @returns [{CtsUrn}, {CtsUrn}]
	**/
	equalizePassageDepths(other){
		if (!this.passage){
			throw new CtsUrnError(`URN ${this} has no passage-component.`)
		}
		if (!other.passage){
			throw new CtsUrnError(`URN ${other} has no passage-component.`)
		}
		let depths = [];
		if (this.isRange()){
			depths.push(this.rangeDepth()[0]);
			depths.push(this.rangeDepth()[1]);
		} else {
			depths.push(this.passageDepth());
		}
		if (other.isRange()){
			depths.push(other.rangeDepth()[0]);
			depths.push(other.rangeDepth()[1]);
		} else {
			depths.push(other.passageDepth());
		}
		let minDepth = Math.min(...depths);
		let u1 = this.passageToDepth(minDepth);
		let u2 = other.passageToDepth(minDepth);

		return [u1, u2];
	}

} // end `class CtsUrn`

















