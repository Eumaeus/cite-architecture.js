/**
 * CtsLibrary
 * Combines an Array of CtsCatalogEntry objects with a CtsCorpus.
 * All instances are immutable.
 */

class CtsLibraryError extends Error {
  constructor(message) {
    super(message);
    this.name = "CtsLibraryError";
  }
}

class CtsLibrary {

  /**
   * @param {CtsCatalogEntry[]} catalogEntries
   * @param {CtsCorpus} corpus
   */
  constructor(catalogEntries, corpus) {
    // ---- Type checks ----
    if (!(catalogEntries instanceof Array)) {
      throw new CtsLibraryError("CtsLibrary.catalog must be an Array of CtsCatalogEntry objects.");
    }
    if (!catalogEntries.every(e => e instanceof CtsCatalogEntry)) {
      throw new CtsLibraryError("CtsLibrary.catalog must contain only CtsCatalogEntry objects.");
    }
    if (!(corpus instanceof CtsCorpus)) {
      throw new CtsLibraryError("CtsLibrary.corpus must be a CtsCorpus object.");
    }

    // ---- Uniqueness of catalog entries (by URN) ----
    const seen = new Set();
    for (const entry of catalogEntries) {
      const key = entry.ctsUrn.toString();
      if (seen.has(key)) {
        throw new CtsLibraryError(
          `Duplicate catalog entry for URN ${key}. Catalog entries must be unique by URN.`
        );
      }
      seen.add(key);
    }

    // ---- Online / corpus consistency ----
    for (const entry of catalogEntries) {
      const present = corpus.hasText(entry.ctsUrn);   // exact bibliographic match
      if (entry.online && !present) {
        throw new CtsLibraryError(
          `Catalog entry ${entry.ctsUrn.toString()} is marked online=true but has no passages in the corpus.`
        );
      }
      if (!entry.online && present) {
        throw new CtsLibraryError(
          `Catalog entry ${entry.ctsUrn.toString()} is marked online=false but has passages in the corpus.`
        );
      }
    }

    // ---- Store (defensive copy of the array) ----
    this.catalog = [...catalogEntries];
    this.corpus  = corpus;
  }

  // ------------------------------------------------------------------
  // Construction & Serialization
  // ------------------------------------------------------------------

  /**
   * @param {string} [delimiter="#"]
   * @returns {string}
   */
  toString(delimiter = "#") {
    const header = "urn#citationScheme#groupName#workTitle#versionLabel#exemplarLabel#online#lang"
      .split("#").join(delimiter);

    let out = "#!ctscatalog\n" + header + "\n";
    for (const entry of this.catalog) {
      out += entry.toString(false, delimiter) + "\n";
    }
    out += "\n#!ctsdata\n";
    // Re-use CtsCorpus serialisation if it exists; otherwise build manually
    if (typeof this.corpus.toString === "function") {
      out += this.corpus.toString(delimiter);
    } else {
      // Fallback: one passage per line
      for (const p of this.corpus.passages) {
        out += p.toString(delimiter) + "\n";
      }
    }
    return out.trimEnd() + "\n";
  }

  /**
   * Static factory from a CEX string.
   * Handles multiple #!ctscatalog / #!ctsdata blocks according to the API rules.
   *
   * @param {string} cexString
   * @param {string} [delimiter="#"]
   * @returns {CtsLibrary}
   */
  static fromCex(cexString, delimiter = "#") {
    if (typeof cexString !== "string") {
      throw new CtsLibraryError("CtsLibrary.fromCex() requires a string argument.");
    }

    const lines = cexString.split(/\r?\n/);
    const catalogEntries = [];
    const passageBlocks  = [];          // array of arrays of CtsPassage
    let currentBlockType = null;        // "catalog" | "data" | null
    let currentDataPassages = [];

    const flushDataBlock = () => {
      if (currentDataPassages.length > 0) {
        passageBlocks.push(currentDataPassages);
        currentDataPassages = [];
      }
    };

    for (let raw of lines) {
      const line = raw.trim();
      if (line === "" || line.startsWith("//")) continue;

      if (line.startsWith("#!ctscatalog")) {
        flushDataBlock();
        currentBlockType = "catalog";
        continue;
      }
      if (line.startsWith("#!ctsdata")) {
        flushDataBlock();
        currentBlockType = "data";
        continue;
      }

      // Skip the column-header line that follows #!ctscatalog
      if (currentBlockType === "catalog" &&
          (line.startsWith("urn" + delimiter) || line.startsWith("urn#"))) {
        continue;
      }

      if (currentBlockType === "catalog") {
        try {
          const entry = CtsCatalogEntry.fromString(line, delimiter);
          catalogEntries.push(entry);
        } catch (e) {
          throw new CtsLibraryError(`Failed to parse catalog line: ${line}\n${e.message}`);
        }
      } else if (currentBlockType === "data") {
        try {
          const psg = CtsPassage.fromString(line, delimiter);
          currentDataPassages.push(psg);
        } catch (e) {
          throw new CtsLibraryError(`Failed to parse data line: ${line}\n${e.message}`);
        }
      }
      // else: ignore stray content
    }
    flushDataBlock();

    // ---- De-duplicate catalog (keep first occurrence) ----
    const uniqueCatalog = [];
    const seenUrns = new Set();
    for (const entry of catalogEntries) {
      const key = entry.ctsUrn.toString();
      if (!seenUrns.has(key)) {
        seenUrns.add(key);
        uniqueCatalog.push(entry);
      }
    }

    // ---- Build corpus from all data blocks, but forbid the same text in >1 block ----
    const textToBlock = new Map();   // biblio-string → block index
    const allPassages = [];

    for (let bi = 0; bi < passageBlocks.length; bi++) {
      const block = passageBlocks[bi];
      for (const p of block) {
        const textKey = p.ctsUrn.dropPassage().toString();
        if (textToBlock.has(textKey) && textToBlock.get(textKey) !== bi) {
          throw new CtsLibraryError(
            `Text ${textKey} appears in more than one #!ctsdata block. ` +
            `Canonical order cannot be preserved.`
          );
        }
        textToBlock.set(textKey, bi);
        allPassages.push(p);
      }
    }

    const corpus = new CtsCorpus(allPassages);

    // ---- Force .online according to actual presence in the corpus ----
    const finalCatalog = uniqueCatalog.map(entry => {
      const present = corpus.hasText(entry.ctsUrn);
      if (entry.online === present) {
        return entry;                     // already correct
      }
      // Need a new entry with corrected online flag
      return new CtsCatalogEntry(
        entry.ctsUrn,
        entry.citationScheme,
        entry.groupName,
        entry.workTitle,
        entry.versionLabel,
        entry.exemplarLabel,
        present,                          // corrected
        entry.lang
      );
    });

    return new CtsLibrary(finalCatalog, corpus);
  }

  // ------------------------------------------------------------------
  // Catalog Accessors
  // ------------------------------------------------------------------

  onlineTexts() {
    return this.catalog.filter(e => e.online === true);
  }

  offlineTexts() {
    return this.catalog.filter(e => e.online === false);
  }

  /**
   * @param {CtsUrn} urn
   * @returns {number}
   */
  sizeOfText(urn) {
    if (!(urn instanceof CtsUrn)) {
      throw new CtsLibraryError("sizeOfText requires a CtsUrn argument.");
    }
    const refs = this.corpus.getValidReff(urn);
    if (refs.length === 0) {
      throw new CtsLibraryError(`No passages match ${urn.toString()} in this library.`);
    }
    return refs.length;
  }

  // ------------------------------------------------------------------
  // Subsetting / Retrieval
  // ------------------------------------------------------------------

  /**
   * Exact bibliographic match.
   * @param {CtsUrn} urn
   * @returns {CtsCatalogEntry}
   */
  entryForUrn(urn) {
    if (!(urn instanceof CtsUrn)) {
      throw new CtsLibraryError("entryForUrn requires a CtsUrn argument.");
    }
    const found = this.catalog.find(e => e.isEntryForText(urn));
    if (!found) {
      throw new CtsLibraryError(
        `No catalog entry for ${urn.dropPassage().toString()} in this library.`
      );
    }
    return found;
  }

  /**
   * @param {CtsCorpus} corpus
   * @returns {CtsCatalogEntry[]}
   */
  entriesForCorpus(corpus) {
    if (!(corpus instanceof CtsCorpus)) {
      throw new CtsLibraryError("entriesForCorpus requires a CtsCorpus argument.");
    }
    const result = [];
    for (const textUrn of corpus.texts) {
      const entry = this.catalog.find(e => e.ctsUrn.equals(textUrn));
      if (!entry) {
        throw new CtsLibraryError(
          `Corpus contains text ${textUrn.toString()} that is not present in this library's catalog.`
        );
      }
      result.push(entry);
    }
    return result;
  }

  /**
   * @param {CtsUrn[]} urns
   * @returns {CtsCatalogEntry[]}
   */
  entriesForUrns(urns) {
    if (!(urns instanceof Array) || !urns.every(u => u instanceof CtsUrn)) {
      throw new CtsLibraryError("entriesForUrns requires an Array of CtsUrn objects.");
    }
    // Build a temporary corpus of the texts (empty passages are fine for this purpose)
    // but simpler: just map through entryForUrn / find
    const result = [];
    const seen = new Set();
    for (const u of urns) {
      const textKey = u.dropPassage().toString();
      if (seen.has(textKey)) continue;
      seen.add(textKey);
      result.push(this.entryForUrn(u));   // re-uses the exact-match + throw logic
    }
    return result;
  }

  /**
   * Hierarchical filter.
   * @param {CtsUrn} urn
   * @returns {CtsLibrary}
   */
  libraryFromUrn(urn) {
    if (!(urn instanceof CtsUrn)) {
      throw new CtsLibraryError("libraryFromUrn requires a CtsUrn argument.");
    }

    const newCorpus = this.corpus.getText(urn);
    if (newCorpus.passages.length === 0) {
      throw new CtsLibraryError(
        `URN ${urn.toString()} matches no passages in this library.`
      );
    }

    // Retain every catalog entry congruent with the filter
    const retained = this.catalog.filter(e =>
      urn.isCongruentWith(e.ctsUrn)
    );

    // Recompute .online against the new corpus
    const newCatalog = retained.map(entry => {
      const present = newCorpus.hasText(entry.ctsUrn);
      if (entry.online === present) return entry;
      return new CtsCatalogEntry(
        entry.ctsUrn,
        entry.citationScheme,
        entry.groupName,
        entry.workTitle,
        entry.versionLabel,
        entry.exemplarLabel,
        present,
        entry.lang
      );
    });

    return new CtsLibrary(newCatalog, newCorpus);
  }

  /**
   * @param {CtsUrn[]} urns
   * @returns {CtsLibrary}
   */
  libraryFromUrns(urns) {
    if (!(urns instanceof Array) || !urns.every(u => u instanceof CtsUrn)) {
      throw new CtsLibraryError("libraryFromUrns requires an Array of CtsUrn objects.");
    }
    if (urns.length === 0) {
      throw new CtsLibraryError("libraryFromUrns requires a non-empty array.");
    }

    // Union of getText results
    let allPassages = [];
    const seenPsg = new Set();
    for (const u of urns) {
      const sub = this.corpus.getText(u);
      for (const p of sub.passages) {
        const key = p.ctsUrn.toString();
        if (!seenPsg.has(key)) {
          seenPsg.add(key);
          allPassages.push(p);
        }
      }
    }
    if (allPassages.length === 0) {
      throw new CtsLibraryError("None of the supplied URNs match any passages in this library.");
    }
    const newCorpus = new CtsCorpus(allPassages);

    // Retain entries congruent with *any* of the filter URNs
    const retained = this.catalog.filter(entry =>
      urns.some(u => u.isCongruentWith(entry.ctsUrn))
    );

    const newCatalog = retained.map(entry => {
      const present = newCorpus.hasText(entry.ctsUrn);
      if (entry.online === present) return entry;
      return new CtsCatalogEntry(
        entry.ctsUrn,
        entry.citationScheme,
        entry.groupName,
        entry.workTitle,
        entry.versionLabel,
        entry.exemplarLabel,
        present,
        entry.lang
      );
    });

    return new CtsLibrary(newCatalog, newCorpus);
  }

  /**
   * @param {CtsCorpus} corpus
   * @returns {CtsLibrary}
   */
  libraryFromCorpus(corpus) {
    if (!(corpus instanceof CtsCorpus)) {
      throw new CtsLibraryError("libraryFromCorpus requires a CtsCorpus argument.");
    }

    const newCatalog = this.entriesForCorpus(corpus);   // exact match + throws if missing

    // All entries are online by construction
    const forcedOnline = newCatalog.map(entry => {
      if (entry.online) return entry;
      return new CtsCatalogEntry(
        entry.ctsUrn,
        entry.citationScheme,
        entry.groupName,
        entry.workTitle,
        entry.versionLabel,
        entry.exemplarLabel,
        true,
        entry.lang
      );
    });

    return new CtsLibrary(forcedOnline, corpus);
  }
}