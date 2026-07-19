
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
    this.length = this.passages.length;
    const first = this.passages[0];
    this.summary = `CtsCorpus (${this.length} passages): [ ${first.urn}: ${first.text.slice(0, 7)}… ]`;
  }

  // -- Retrieval Methods

  toString(delimiter = '#') {
    return this.passages.map(p => p.toString(delimiter)).join("\n");
  }

  // -- Query/Assessment Methods

    // Returns array of CtsUrn objects present in the corpus.
  // If optional `urn` is supplied, filters to those passages
  // that are hierarchically included by `urn` (using passageContains / passageIncludes).
  getValidReff(urn = null) {
    if (!urn) {
      return this.passages.map(p => p.urn);
    }
    // Filter using the retrieval semantics:
    // keep corpus passages that are "under" the supplied urn
    return this.passages
      .filter(p => urn.isCongruentWith(p.urn))
      .map(p => p.urn);
  }

  // Like getValidReff(urn), but returns the count instead of the array.
  // Requires a CtsUrn parameter (per current spec).
  countValidReff(urn) {
    if (!urn) {
      throw new CtsCorpusError("countValidReff requires a CtsUrn argument.");
    }
    return this.getValidReff(urn).length;
  }

  // Returns true if this exact URN is present in the corpus.
  isValidRef(urn) {
    if (!urn) return false;
    return this.passages.some(p => p.urn.equals(urn));
  }



}