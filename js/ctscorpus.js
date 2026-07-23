
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
   * Returns a corpus consisting only of passages from
   * the same text as `urn`.
   *  
   * @param {CtsUrn} - urn
   * @returns {CtsCorpus}
  **/
  textCorpus(urn) {
    if (!urn || !(urn instanceof CtsUrn)) {
      throw new CtsCorpusError("CtsCorpus.textCorpus() requires a CtsUrn argument.");
    }

    let tempCorpus = this.getText(urn.dropPassage());

    return tempCorpus;
    
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
   * If a `CtsUrn` is given, drops the passage-component and returns the first citation of the first text *congruent* 
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
        let urns = this.getValidReff(urn.dropPassage());
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
   * first passage of the corpus. Returns `null` if `urn` does not
   * have an exact match in the corpus. 
   * 
   * @param {CtsUrn} - urn
   * *@returns {CtsUrn}
  **/
  getPrevRef(urn) {
    if (!urn || !(urn instanceof CtsUrn)) {
      throw new CtsCorpusError("CtsCorpus.getPrevRef() requires a CtsUrn argument.");
    }
    let tempCorpus = this.textCorpus(urn);
    let thisIndex = tempCorpus.urns.findIndex(u => u.equals(urn));
    if (thisIndex == 0) return null;
    let prevIndex = thisIndex - 1;
    return tempCorpus.urns[prevIndex];
  }

  /**
   * `CtsCorpus.getNextRef(urn: CtsUrn)` - Returns a `CtsUrn`. 
   * Gets the urn of the passage following the given urn in the 
   * corpus. Returns `null` if the urn points to the last 
   * passage of the corpus. Returns `null` if `urn` does not
   * have an exact match in the corpus.
   * 
   * @param {CtsUrn} - urn
   * *@returns {CtsUrn}
  **/ 
  getNextRef(urn){
    if (!urn || !(urn instanceof CtsUrn)) {
      throw new CtsCorpusError("CtsCorpus.getNextRef() requires a CtsUrn argument.");
    }
    let tempCorpus = this.textCorpus(urn);
    let thisIndex = tempCorpus.urns.findIndex(u => u.equals(urn));
    if ((thisIndex + 1) == tempCorpus.length) return null;
    let nextIndex = thisIndex + 1;
    return tempCorpus.urns[nextIndex];
  }

  /**  
   * `CtsCorpus.getPrev(urn:CtsUrn)` - Returns a `CtsPassage`. 
   * Gets the passage preceding the passage with the given urn 
   * in the corpus. Returns `null` if the urn points to the 
   * first passage of the corpus. Returns `null` if `urn` does not
   * have an exact match in the corpus.
   * 
   * @param {CtsUrn} - urn
   * *@returns {CtsPassage}
  **/
  getPrev(urn){
    if (!urn || !(urn instanceof CtsUrn)) {
      throw new CtsCorpusError("CtsCorpus.getPrev() requires a CtsUrn argument.");
    }
    let prevUrn = this.getPrevRef(urn);
    if ( (prevUrn == null) || !(prevUrn instanceof CtsUrn) ) return null;
    return this.getPassage(prevUrn);
  }

  /** 
   * `CtsCorpus.getNext(urn: CtsUrn)` - Returns a `CtsPassage`. 
   * Gets the passage following the passage with the given urn 
   * in the corpus. Returns `null` if the urn points to the 
   * last passage of the corpus. Returns `null` if `urn` does not
   * have an exact match in the corpus.
   * 
   * @param {CtsUrn} - urn
   * *@returns {CtsPassage}
  **/
  getNext(urn){
    if (!urn || !(urn instanceof CtsUrn)) {
      throw new CtsCorpusError("CtsCorpus.getNext() requires a CtsUrn argument.");
    }
    let nextUrn = this.getNextRef(urn);
    if ( (nextUrn == null) || !(nextUrn instanceof CtsUrn) ) return null;

    return this.getPassage(nextUrn);
  }

  // =========================================================
  // -- For Browsing a Corpus

/**
 * `CtsCorpus.slideRange(urn:CtsUrn, step:Int)` - 
 * Returns a range-`CtsUrn`. Based on the start- and 
 * end-passages of the given range-urn, return a URN 
 * identifying a range whose starting passage and ending 
 * passage are `step` passages forward or backward. 
 * 
 * A positive `step` moves forward, toward the end of 
 * the corpus; a negative `step` moves backwards, 
 * toward the beginning of the corpus. 
 * 
 * If corpus `this` contains more than one text, 
 * `.slideRange()` will not move beyond the text identified 
 * by the parameter urn.
 * 
 * If the "step"  would move the *end* of the range beyond 
 * the end of the text, returns a smaller "window", whose 
 * last passage is the last passage of the text in this corpus. 
 * 
 * If the "step" would move the *start* of the range beyond 
 * the end of the requested text,  returns `null`.
 * 
 *@param {CtsUrn} - urn
 *@param {Int} - step
 *@returns {CtsUrn}
**/
  slideRange(urn, step = 1) {
    if (!urn || !(urn instanceof CtsUrn)) {
      throw new CtsCorpusError("CtsCorpus.slideRange(CtsUrn, Int) requires the first parameter to be a CtsUrn.");
    }
    if (!(Number.isInteger(step))) {
      throw new CtsCorpusError("CtsCorpus.slideRange(CtsUrn, Int) requires the second parameter to be an Int.");
    }

    // Get temp Corpus from URN with only the text of `urn`
    let tempCorpus = this.textCorpus(urn);

    // If `urn` isn't a range urn, make it one so we can keep things easy.
    let tempUrn = urn;
    if (!tempUrn.isRange()) {
      let psg = urn.passage;
      tempUrn = tempUrn.addPassage(`${psg}-${psg}`);
    }

    // Split it to [0] and [1].
    let splitUrn = tempUrn.splitRange();

    // Some useful data:
    let lastIndexOfCorpus = tempCorpus.length - 1;

    // Get index of [0] and [1]
    let index0 = tempCorpus.urns.findIndex( u => u.equals(splitUrn[0]));
    let index1 = tempCorpus.urns.findIndex( u => u.equals(splitUrn[1]));

    // Increment
    let newIndex0 = index0 + step;
    let newIndex1 = index1 + step;

    // Bounds-check
    if (newIndex0 < 0) newIndex0 = 0;
    if (newIndex1 > lastIndexOfCorpus) newIndex1 = lastIndexOfCorpus;
    if (newIndex0 > lastIndexOfCorpus) return null;
    if (newIndex1 < 0) return null;

    // New URN, and reduce if possible
    let newStartUrn = tempCorpus.urns[newIndex0];
    let newEndUrn = tempCorpus.urns[newIndex1];
    let newUrn = newStartUrn.makeRange(newEndUrn);

    return newUrn.reduceRange();
  }

  /**
   * `CtsCorpus.changeContext(urn: CtsUrn, after: {Int}, before?: {Int}`
   * Given a `CtsUrn` identifying a chunk of a corpus, returns a 
   * range-`CtsUrn` a larger or smaller chunk. The `after` parameter 
   * determines how many passages will be added to the end of the URN 
   * (positive value) or subtracted from it (negative value). 
   * The `before` parameter determines how many will be added 
   * (positive values) or subtracted (negative values) from the 
   * beginning of the URN. Limited by the bounds of the text. 
   * Never returns `null`. At the extreme of reducing context, 
   * returns a single-passage URN. At the extremes of expanding 
   * context, returns a range identifying the whole text. 
   * 
   * @param {CtsUrn} - urn
   * @param {Int} - after
   * @param {Int} - before
   * @returns {CtsUrn}
  **/
  changeContext(urn, after, before = 0) {
    if (!urn || !(urn instanceof CtsUrn)) {
      throw new CtsCorpusError("CtsCorpus.changeContext(CtsUrn, Int, Int) requires the first parameter to be a CtsUrn.");
    }
    if (!(Number.isInteger(after))) {
      throw new CtsCorpusError("CtsCorpus.changeContext(CtsUrn, Int) requires the second parameter to be an Int.");
    }
    if (!(Number.isInteger(before))) {
      throw new CtsCorpusError("CtsCorpus.changeContext(CtsUrn, Int) requires the second parameter to be an Int.");
    }

    // Get temp Corpus from URN with only the text of `urn`
    let tempCorpus = this.textCorpus(urn);

    // If `urn` isn't a range urn, make it one so we can keep things easy.
    let tempUrn = urn;
    if (!tempUrn.isRange()) {
      let psg = urn.passage;
      tempUrn = tempUrn.addPassage(`${psg}-${psg}`);
    }

    // Split it to [0] and [1].
    let splitUrn = tempUrn.splitRange();

    // Some useful data:
    let lastIndexOfCorpus = tempCorpus.length - 1;

    // Get index of [0] and [1]
    let index0 = tempCorpus.urns.findIndex( u => u.equals(splitUrn[0]));
    let index1 = tempCorpus.urns.findIndex( u => u.equals(splitUrn[1]));

    //Increment
    let newIndex0 = index0 + (0 - before);
    let newIndex1 = index1 + after;

    //Bounds-checking
    //    boundaries of text
    if (newIndex1 < 0) newIndex1 = 0;
    if (newIndex1 > lastIndexOfCorpus) newIndex1 = lastIndexOfCorpus;
    if (newIndex0 < 0) newIndex0 = 0;
    if (newIndex0 > lastIndexOfCorpus) newIndex0 = lastIndexOfCorpus;

    // Dealing with extreme cases of reduction…
    if (newIndex0 > index1) newIndex0 = index1;
    if (newIndex1 < newIndex0) newIndex1 = newIndex0;

    // New URN, and reduce if possible
    let newStartUrn = tempCorpus.urns[newIndex0];
    let newEndUrn = tempCorpus.urns[newIndex1];
    let newUrn = newStartUrn.makeRange(newEndUrn);

    return newUrn.reduceRange();
  }


} // End Class CtsCorpus