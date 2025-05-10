const regularBoards = [
  { name: 'a', link: 'https://spiritislandwiki.com/images/e/e2/Piece_core_board_a.png' },
  { name: 'b', link: 'https://spiritislandwiki.com/images/7/7a/Piece_core_board_b.png' },
  { name: 'c', link: 'https://spiritislandwiki.com/images/8/82/Piece_core_board_c.png' },
  { name: 'd', link: 'https://spiritislandwiki.com/images/3/3a/Piece_core_board_d.png' },
  { name: 'e', link: 'https://spiritislandwiki.com/images/e/e5/Piece_je_board_e.png' },
  { name: 'f', link: 'https://spiritislandwiki.com/images/0/0b/Piece_je_board_f.png' },
  { name: 'g', link: 'https://spiritislandwiki.com/images/d/d4/Piece_horizons_board_g.png' },
  { name: 'h', link: 'https://spiritislandwiki.com/images/4/4a/Piece_horizons_board_h.png' },
];

const thematicBoards = [
  { name: 'northeast', link: 'https://spiritislandwiki.com/images/f/f9/Piece_core_board_north_east.png' },
  { name: 'northwest', link: 'https://spiritislandwiki.com/images/8/8c/Piece_core_board_north_west.png' },
  { name: 'east', link: 'https://spiritislandwiki.com/images/5/58/Piece_core_board_east.png' },
  { name: 'west', link: 'https://spiritislandwiki.com/images/2/26/Piece_core_board_west.png' },
  { name: 'southeast', link: 'https://spiritislandwiki.com/images/c/cc/Piece_je_board_south_east.png' },
  { name: 'southwest', link: 'https://spiritislandwiki.com/images/6/64/Piece_je_board_south_west.png' },
];

exports.regularBoards = regularBoards;
exports.thematicBoards = thematicBoards;
exports.allBoards = [...regularBoards, ...thematicBoards];
