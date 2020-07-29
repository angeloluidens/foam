import { NoteGraph, Note } from '../src/note-graph';

const position = {
  start: { line: 1, column: 1 },
  end: { line: 0, column: 0 },
};

const documentStart = position.start;
const documentEnd = position.end;
const eol = '\n';

describe('Note graph', () => {
  it('Adds notes to graph', () => {
    const graph = new NoteGraph();
    graph.setNote(
      new Note(
        'page-a',
        null,
        'page-a',
        [],
        [],
        documentStart,
        documentEnd,
        eol,
        '/page-a.md',
        ''
      )
    );
    graph.setNote(
      new Note(
        'page-b',
        null,
        'page-b',
        [],
        [],
        documentStart,
        documentEnd,
        eol,
        '/page-b.md',
        ''
      )
    );
    graph.setNote(
      new Note(
        'page-c',
        null,
        'page-c',
        [],
        [],
        documentStart,
        documentEnd,
        eol,
        '/page-c.md',
        ''
      )
    );

    expect(
      graph
        .getNotes()
        .map(n => n.id)
        .sort()
    ).toEqual(['page-a', 'page-b', 'page-c']);
  });

  it('Detects forward links', () => {
    const graph = new NoteGraph();
    graph.setNote(
      new Note(
        'page-a',
        null,
        'page-a',
        [],
        [],
        documentStart,
        documentEnd,
        eol,
        '/page-a.md',
        ''
      )
    );
    graph.setNote(
      new Note(
        'page-b',
        null,
        'page-b',
        [{ to: 'page-a', text: 'go', position }],
        [],
        documentStart,
        documentEnd,
        eol,
        '/page-b.md',
        ''
      )
    );
    graph.setNote(
      new Note(
        'page-c',
        null,
        'page-c',
        [],
        [],
        documentStart,
        documentEnd,
        eol,
        '/page-c.md',
        ''
      )
    );

    expect(
      graph
        .getForwardLinks('page-b')
        .map(link => link.to)
        .sort()
    ).toEqual(['page-a']);
  });

  it('Detects backlinks', () => {
    const graph = new NoteGraph();
    graph.setNote(
      new Note(
        'page-a',
        null,
        'page-a',
        [],
        [],
        documentStart,
        documentEnd,
        eol,
        '/page-a.md',
        ''
      )
    );
    graph.setNote(
      new Note(
        'page-b',
        null,
        'page-b',
        [{ to: 'page-a', text: 'go', position }],
        [],
        documentStart,
        documentEnd,
        eol,
        '/page-b.md',
        ''
      )
    );
    graph.setNote(
      new Note(
        'page-c',
        null,
        'page-c',
        [],
        [],
        documentStart,
        documentEnd,
        eol,
        '/page-c.md',
        ''
      )
    );

    expect(
      graph
        .getBacklinks('page-a')
        .map(link => link.from)
        .sort()
    ).toEqual(['page-b']);
  });

  it('Fails when accessing non-existing node', () => {
    expect(() => {
      const graph = new NoteGraph();
      graph.setNote(
        new Note(
          'page-a',
          null,
          'page-a',
          [],
          [],
          documentStart,
          documentEnd,
          eol,
          '/path-b.md',
          ''
        )
      );
      graph.getNote('non-existing');
    }).toThrow();
  });

  it('Allows adding edges to non-existing documents', () => {
    const graph = new NoteGraph();
    graph.setNote(
      new Note(
        'page-a',
        null,
        'page-a',
        [{ to: 'non-existing', text: 'does not exist', position }],
        [],
        documentStart,
        documentEnd,
        eol,
        '/path-b.md',
        ''
      )
    );
    expect(graph.getNote('non-existing')).toBeUndefined();
  });

  it('Updates links when modifying note', () => {
    const graph = new NoteGraph();
    graph.setNote(
      new Note(
        'page-a',
        null,
        'page-a',
        [],
        [],
        documentStart,
        documentEnd,
        eol,
        '/page-a.md',
        ''
      )
    );
    graph.setNote(
      new Note(
        'page-b',
        null,
        'page-b',
        [{ to: 'page-a', text: 'go', position }],
        [],
        documentStart,
        documentEnd,
        eol,
        '/page-b.md',
        ''
      )
    );
    graph.setNote(
      new Note(
        'page-c',
        null,
        'page-c',
        [],
        [],
        documentStart,
        documentEnd,
        eol,
        '/page-c.md',
        ''
      )
    );

    expect(
      graph
        .getForwardLinks('page-b')
        .map(link => link.to)
        .sort()
    ).toEqual(['page-a']);
    expect(
      graph
        .getBacklinks('page-a')
        .map(link => link.from)
        .sort()
    ).toEqual(['page-b']);
    expect(
      graph
        .getBacklinks('page-c')
        .map(link => link.from)
        .sort()
    ).toEqual([]);

    graph.setNote(
      new Note(
        'page-b',
        null,
        'page-b',
        [{ to: 'page-c', text: 'go', position }],
        [],
        documentStart,
        documentEnd,
        eol,
        '/path-2b.md',
        ''
      )
    );

    expect(
      graph
        .getForwardLinks('page-b')
        .map(link => link.to)
        .sort()
    ).toEqual(['page-c']);
    expect(
      graph
        .getBacklinks('page-a')
        .map(link => link.from)
        .sort()
    ).toEqual([]);
    expect(
      graph
        .getBacklinks('page-c')
        .map(link => link.from)
        .sort()
    ).toEqual(['page-b']);
  });
});
