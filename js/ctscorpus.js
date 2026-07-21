
// --------------------------
// --- CtsCorpus Class -----
//
// A `CtsCorpus` is an Array of `CtsPassage` objects. 

// **The order of the elements in the array is significant.**
// 
// Create a new `CtsCorpus` object with:
// 
//     psg1 = new CtsPassage(new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1"), "μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος");
//     psg2 = new CtsPassage(new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2"),  "οὐλομένην, ἣ μυρί’ Ἀχαιοῖς ἄλγε’ ἔθηκε,");
//     psg3 = new CtsPassage(new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.3"), "πολλὰς δ’ ἰφθίμους ψυχὰς Ἄϊδι προΐαψεν");
//     
//     my_ctscorpus = new CtsCorpus([ psg1, psg2, psg3]);
// 
// --------------------------

class CtsCorpusError extends Error {
  constructor(message) {
    super(message);
    this.name = "CtsCorpusError";
  }
}

class CtsCorpus {
  constructor(passageArray) {
    if (!(passageArray instanceof Array)) {
      throw new CtsCorpusError("passageArray must be an array.");
    }
    if (!passageArray.every(item => item instanceof CtsPassage)) {
      throw new CtsCorpusError("passageArray must be an array of CtsPassage objects.");
    }
    if (passageArray.length === 0) {
      this.passages = [];
      this.length = 0;
      this.summary = "CtsCorpus (0 passages): empty";
      return;
    }

    // 1. Uniqueness of URNs (robust string-based)
    const urnStrings = passageArray.map(psg => psg.urn.toString() || psg.urn.urnstring);
    const uniqueUrnStrings = new Set(urnStrings);
    if (urnStrings.length !== uniqueUrnStrings.size) {
      throw new CtsCorpusError("Each URN in a CtsCorpus must be unique.");
    }

    // 2. Atomic / node-level (single citable node, not range)
    //    (Non-range + has passage is already enforced by CtsPassage,
    //     but we make it explicit + check hasPassage)
    passageArray.forEach((psg, idx) => {
      const u = psg.urn;
      if (!u.hasPassage() || u.isRange()) {
        throw new CtsCorpusError(
          `Passage at index ${idx} is not atomic (node-level): must have a passage component and not be a range.`
        );
      }
      // Optional stricter check if you want only version/exemplar level
      // if (!u.isVersionUrn() && !u.isExemplarUrn()) { ... }
    });

    // 3. No hierarchical containment between any two passages
    for (let i = 0; i < passageArray.length; i++) {
      for (let j = i + 1; j < passageArray.length; j++) {
        const u1 = passageArray[i].urn;
        const u2 = passageArray[j].urn;
        if (u1.passageContains(u2) || u2.passageContains(u1) ||
            u1.passageIncludes(u2) || u2.passageIncludes(u1)) {
          throw new CtsCorpusError(
            `Passage at index ${i} hierarchically contains or is contained by passage at index ${j}.`
          );
        }
      }
    }

    // 4. Same-text passages must be contiguous (no interleaving)
    //    Text identifier = URN without passage component
    const textGroups = new Map();
    for (let i = 0; i < passageArray.length; i++) {
      const tid = passageArray[i].urn.dropPassage().toString();
      if (!textGroups.has(tid)) textGroups.set(tid, []);
      textGroups.get(tid).push(i);
    }
    for (const [tid, indices] of textGroups) {
      if (indices.length > 1) {
        const sorted = [...indices].sort((a, b) => a - b);
        for (let k = 1; k < sorted.length; k++) {
          if (sorted[k] !== sorted[k - 1] + 1) {
            throw new CtsCorpusError(
              `Passages from the same text (${tid}) are not contiguous (interleaved).`
            );
          }
        }
      }
    }


    this.passages = passageArray;
    this.urns = this.passages.map(p => p.urn);

    // Make `.texts` property
    const noPsgUrn = passageArray.map(psg => psg.urn.dropPassage());
    const noPstUrnStrings = noPsgUrn.map(psg => psg.toString());
    const uniqueTextUrnStrings = new Set(noPstUrnStrings);
    this.texts = [...uniqueTextUrnStrings].map(us => new CtsUrn(us));

    this.length = this.passages.length;
    const first = this.passages[0];
    this.summary = `CtsCorpus (${this.length} passages): [ ${first.urn}: ${first.text.slice(0, 7)}… ]`;
  } // end constructor

  // =========================================================
  // Static factory function

  static fromString(cexstring, delimiter = '#') {
    if (typeof cexstring !== 'string') {
      throw new CtsPassageError("Input must be a string.");
    }
    if (cexstring.trim() == "") return new CtsCorpus([]);
    let lines = cexstring.split("\n").filter(ln => ln.includes(delimiter));
    if (lines[0].includes("#!ctsdata")) lines.shift();
    let passages = lines.map(line => CtsPassage.fromString(line, delimiter));
    return new CtsCorpus(passages);
  }

  // =========================================================
  // -- Retrieval Methods

  toString(delimiter = '#') {
    return this.passages.map(p => p.toString(delimiter)).join("\n");
  }


  // =========================================================
  // -- Query/Assessment Methods

  /**
   * Returns `true` if the text identified by `urn` represented by any 
   * passage in the corpus. `urn` may contain a passage-component, 
   *which is ignored by this function.
   * Requires a CtsUrn parameter (per current spec)
   *
   * @param {CtsUrn} - urn
   * @returns {Boolean}
  **/
  hasText(urn) {
    if (!urn || !(urn instanceof CtsUrn)) {
      throw new CtsCorpusError("CtsCorpus.hasText() requires a CtsUrn argument.");
    }
    let testUrn = urn.dropPassage();
    return this.texts.some(u => u.equals(testUrn));
  }

  /**
   * Returns array of CtsUrn objects present in the corpus.
   * If optional `urn` is supplied, filters to those passages
   * that are hierarchically included by `urn` (using passageContains / passageIncludes).
   *
   * @param {CtsUrn} - urn
   * @returns {Array[CtsUrn]}
   *
   **/
   getValidReff(urn = null) {

    if (!urn) {
      return this.urns;
    }

    let textCorpora = this.textCorpora();

      // Start main logic
    let returnArray = textCorpora.flatMap( (c) => {
      if (urn.isRange()){
      let urn0 = urn.splitRange()[0];
      let urn1 = urn.splitRange()[1];


      let urn0Match = c.urns.filter(u => urn0.isCongruentWith(u, true))[0];
      if (urn0Match == undefined) {
        //console.error(`No match in corpus: (${urn0.passage}) ${urn}.`);
        return [];
      }

      let urn1Match = c.urns.filter(u => urn1.isCongruentWith(u, true)).at(-1);
      if (urn1Match == undefined) {
        //console.error(`No match in corpus: (${urn1.passage}) ${urn}.`);
        return [];
      }

      let startIndex = c.urns.findIndex(u => u.equals(urn0Match));
      let endIndex = c.urns.findIndex(u => u.equals(urn1Match));

      return c.urns.slice(startIndex, (endIndex + 1));

    } else {
      return c.urns.filter(u => urn.isCongruentWith(u, true));
    }
    });
      // End main logic
    return returnArray;
  }

  /**
   * Like getValidReff(urn), but returns the count instead of the array.
   * Requires a CtsUrn parameter (per current spec).
   *
   * @param {CtsUrn}
   * @returns {Int}
  **/
  countValidReff(urn) {
    if (!urn || !(urn instanceof CtsUrn)) {
      throw new CtsCorpusError("CtsCorpus.countValidReff() requires a CtsUrn argument.");
    }
    return this.getValidReff(urn).length;
  }

  /**
   * Returns true if this exact URN is present in the corpus.
   *
   * @param {CtsUrn} - urn
   * @returns {Boolean}
  **/
  isValidRef(urn) {
    if (!urn) return false;
    // May save time with a very large corpus?
    if (!this.hasText(urn)) return false;
    return this.passages.some(p => p.urn.equals(urn));
  }

  /**
   * Returns true if `urn` is a range URN and both its start and end
   * passages exist exactly in the corpus (via isValidRef).
   *
   * @param {CtsUrn} - urn
   * @returns {Boolean}
  **/
  isValidRange(urn) {
    if (!urn || !(urn instanceof CtsUrn) || !urn.isRange()) {
      return false;
    }
    const [start, end] = urn.splitRange();
    return this.isValidRef(start) && this.isValidRef(end);
  }

  /**
   * Returns an Array[CtsUrn] of range-URNs (one per text), each spanning
   * from the first to the last passage of that text.
   * If optional `urn` is supplied, filters results using the same
   * urn-containment logic as getValidReff().
   * Never throws and error — returns [] for empty corpus or when filter yields nothing.
   *
   * @param {CtsUrn} - urn
   * @returns {Array[CtsUrn]}
  **/
  corpusRanges(urn = null) {
    if (this.length === 0) {
      return [];
    }

    // Group by text (dropPassage), tracking first and last passage per text
    // (preserves order of first appearance of each text)
    const textMap = new Map(); // textUrnString → {first: CtsUrn, last: CtsUrn}

    for (const psg of this.passages) {
      const textUrn = psg.urn.dropPassage();
      const key = textUrn.toString();

      if (!textMap.has(key)) {
        textMap.set(key, { first: psg.urn, last: psg.urn });
      } else {
        textMap.get(key).last = psg.urn;
      }
    }

    // Build range URNs
    const ranges = [];
    for (const { first, last } of textMap.values()) {
      const rangePassage = `${first.passage}-${last.passage}`;
      const rangeUrn = first.replacePassage(rangePassage);
      ranges.push(rangeUrn);
    }

    // Apply optional filter (same semantics as getValidReff)
    if (urn) {
      return ranges.filter(r => urn.dropPassage().isCongruentWith(r));
    }

    return ranges;
  }

  /**
   * Returns a range-`CtsUrn` identifying the passages 
   * in an `Array[CtsPassage]`. Parameter `passageArray` must
   * meet the same validation criteria used when constructing a 
   * CtsCorpus. 
   * 
   * @param {Array[CtsPassage]} - passageArray
   * @returns {CtsUrn}
  **/
  rangesFromPassages(passageArray) {
    if (!passageArray || !Array.isArray(passageArray) || !passageArray.every(p => p instanceof CtsPassage) ) {
      throw new CtsCorpusError("CtsCorpus.rangesFromPassages() requires an Array[CtsPassage] argument.");
    }
    let tempCorpus = new CtsCorpus(passageArray);
    return tempCorpus.corpusRanges();
  }

  /**
   * Returns Array[CtsUrn] of the texts (bibliocomponent-level URNs) in the corpus.
   * Without `urn` param → returns this.texts (all texts).
   * With `urn` param → filters to texts that are congruent under the supplied URN
   * (same directional logic as getValidReff / corpusRanges).
   * 
   * @param {CtsUrn} - urn
   * @returns {Array[CtsUrn]}
  **/
  listTexts(urn = null) {
    if (!urn) {
      return this.texts; // or [...this.texts] if you want a defensive copy
    }
    return this.texts.filter(t => urn.dropPassage().isCongruentWith(t));
  }

  // =========================================================
  // -- Refining / Text Retrieval Methods

  /**
   * Returns an Array of CtsCorpus objects, one for each distinct "text"
   * (group of passages sharing the same bibliographic component via dropPassage()).
   * The order of the returned corpora preserves the order in which the texts
   * first appear in the original corpus.
   *
   * @returns {CtsCorpus[]}
   */
  textCorpora() {
    if (this.length === 0) {
      return [];
    }

    const result = [];
    let currentTid = null;
    let currentGroup = [];

    for (const psg of this.passages) {
      const tid = psg.urn.dropPassage().toString();

      if (tid !== currentTid) {
        if (currentGroup.length > 0) {
          result.push(new CtsCorpus(currentGroup));
        }
        currentGroup = [psg];
        currentTid = tid;
      } else {
        currentGroup.push(psg);
      }
    }

    if (currentGroup.length > 0) {
      result.push(new CtsCorpus(currentGroup));
    }

    return result;
  }

  /** 
   * Returns one and only one `CtsPassage`, whose URN is an 
   * exact match with parameter `urn`. Does *not* do any matching 
   * based on hierarchy of bibliography or passage. 
   * Mainly a helper-method for other methods.
   *
   * @param {CtsUrn} - urn
   * @returns {CtsPassage}
  **/
  getPassage(urn) {
    if (!urn || !(urn instanceof CtsUrn)) {
      throw new CtsCorpusError("CtsCorpus.getPassage() requires a CtsUrn argument.");
    }

    let hit = this.passages.filter(p => p.urn.equals(urn));
    if (hit[0] == undefined) {
      throw new CtsCorpusError(`getPassage: No matches for ${urn}.`)
    }
    return hit[0];
  }

  /**
   * Returns a new CtsCorpus containing only the passages whose URNs are
   * hierarchically contained within the supplied urn (using passageContains).
   * This is the primary method for extracting a specific text or a section
   * of a text.
   *
   * @param {CtsUrn} urn
   * @returns {CtsCorpus}
   */
  getText(urn) {
    if (!urn || !(urn instanceof CtsUrn)) {
      throw new CtsCorpusError("CtsCorpus.getText() requires a CtsUrn argument.");
    }

    let filtered = this.getValidReff(urn);
    let passageArray = filtered.map(u => this.getPassage(u));
    // Safety check!
    if (!passageArray || !Array.isArray(passageArray) || !passageArray.every(p => p instanceof CtsPassage) ) {
      throw new CtsCorpusError("CtsCorpus.rangesFromPassages() requires an Array[CtsPassage] argument.");
    }
    //return new CtsCorpus(filtered);
    return new CtsCorpus(passageArray);
  }

  /**
   * Returns a new CtsCorpus containing all passages that are congruent with
   * the supplied urn (using isCongruentWith non-directionally). This is useful for finding
   * corresponding passages across versions or exemplars.
   *
   * @param {CtsUrn} urn
   * @returns {CtsCorpus}
   */
  findPassages(urn) {
    if (!urn || !(urn instanceof CtsUrn)) {
      throw new CtsCorpusError("CtsCorpus.findPassages() requires a CtsUrn argument.");
    }

    const filtered = this.passages.filter(p => urn.isCongruentWith(p.urn, false));
    return new CtsCorpus(filtered);
  }

  // =========================================================
  // -- Navigating a Corpus

  /**
   * `CtsCorpus.getFirstRef(urn?: CtsUrn)` - 
   * Returns a `CtsUrn`, the citation to the first passage of the corpus. 
   * If a `CtsUrn` is given, returns the first citation *congruent* 
   * to the parameter-urn.
   * 
   * @param {CtsUrn} - urn
   * @returns {CtsUrn}
  **/
  getFirstRef(urn = null) {
    if (!urn) {
      return this.passages[0].urn;
    } else {
        if (!(urn instanceof CtsUrn)) {
           throw new CtsCorpusError("CtsCorpus.getFirstRef() requires a CtsUrn argument.");
        }
        let urns = this.getValidReff(urn);
        return urns[0];
    }
  }

  /**
   *CtsCorpus.getFirstPassage(urn: CtsUrn)` - 
   *Returns a `CtsPassage`. Like `getFirstRef()`, but 
   *returns the whole `CtsPassage`.
   *
   *@param {CtsUrn} - urn
   *@returns {CtsPassage}
  **/
  getFirstPassage(urn = null) {
    let firstUrn = this.getFirstRef(urn);
    return this.getPassage(firstUrn);
  }

  /**
   * `CtsCorpus.getPrevRef(urn: CtsUrn)` - Returns a `CtsUrn`. 
   * Gets the urn of the passage preceding the given urn 
   * in the corpus. Returns `null` if the urn points to the 
   * first passage of the corpus.
   * 
   * @param {CtsUrn} - urn
   * *@returns {CtsUrn}
  **/
  getPrevRef(urn) {
    if (!urn || !(urn instanceof CtsUrn)) {
      throw new CtsCorpusError("CtsCorpus.getPrevRef() requires a CtsUrn argument.");
    }
    
  }

  /**
   * `CtsCorpus.getNextRef(urn: CtsUrn)` - Returns a `CtsUrn`. 
   * Gets the urn of the passage following the given urn in the 
   * corpus. Returns `null` if the urn points to the last 
   * passage of the corpus.
   * 
   * @param {CtsUrn} - urn
   * *@returns {CtsUrn}
  **/ 
  getNextRef(urn){
    if (!urn || !(urn instanceof CtsUrn)) {
      throw new CtsCorpusError("CtsCorpus.getNextRef() requires a CtsUrn argument.");
    }
  }

  /**  
   * `CtsCorpus.getPrev(urn:CtsUrn)` - Returns a `CtsPassage`. 
   * Gets the passage preceding the passage with the given urn 
   * in the corpus. Returns `null` if the urn points to the 
   * first passage of the corpus.
   * 
   * @param {CtsUrn} - urn
   * *@returns {CtsPassage}
  **/
  getPrev(urn){
    if (!urn || !(urn instanceof CtsUrn)) {
      throw new CtsCorpusError("CtsCorpus.getPrev() requires a CtsUrn argument.");
    }
  }

  /** 
   * `CtsCorpus.getNext(urn: CtsUrn)` - Returns a `CtsPassage`. 
   * Gets the passage following the passage with the given urn 
   * in the corpus. Returns `null` if the urn points to the 
   * last passage of the corpus.
   * 
   * @param {CtsUrn} - urn
   * *@returns {CtsPassage}
  **/
  getNext(urn){
    if (!urn || !(urn instanceof CtsUrn)) {
      throw new CtsCorpusError("CtsCorpus.getNext() requires a CtsUrn argument.");
    }
  }



} // End Class CtsCorpus