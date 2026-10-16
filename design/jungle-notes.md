# Cheery jungle oasis
Palette: turquoise #2BB3A3, aqua #8FE0D6, deep lagoon #1F7A6B, dark lagoon #123F3A, night lagoon #0C2F2C; deeper stage shade #123E39.
Accents: sand #F4E7CF, coral #F27C6A, hibiscus #FF8FA3, palm #4E9E57, leaf #7FD07C, sunlit gold #F2C66B, bark #8A5A3C.
Base: vertical dark-lagoon gradient; broad upper-right gold radial wash at 0.4% maximum opacity; no texture in the reading area.
Landscape: waterfall x20?100, y60?1025; pool at lower-left; shoreline entirely below y1000.
Landscape: fronds within x1850?1920 below y96; coral/pink flowers near (1873,133)/(1890,180); upper-right header has only 9% foliage shadow.
Landscape: x112?1840/y96?1000 and the x112?480 chat region above the shore contain only the base; the card at (152,112), width1000, clears all art.
Portrait: y0?480 stays plain; thin side foliage starts at y498; blooms near (1054,534)/(1056,578).
Portrait: waterfall near x27?94/y1713?1833 uses the allowed lower-left exception; shoreline starts below y1800; all other content remains base-only.
Both: aqua pool/cream foam, three mist arcs, wavy cream reflections, curved lower-right sand, three coral/pink shells and a small bark/gold torch.
CSS: use cover and centered positioning; edge cropping is intentional; choose the matching aspect-ratio asset to preserve safe zones.
Panels: keep paper #F4EEE1 and ink #1A1F2B; use rgba(12,47,44,.72) behind gold-bordered talking points and .92 opacity for chat; rail/header #0C2F2C.
Motion: three SMIL opacity cycles per SVG (4.8s cascade, 5.6s mist, 3.6s flame), each inside .jungle-anim; static water and flame remain underneath.
Reduced motion: embedded media query hides animated overlays; host CSS cannot reach SMIL inside a CSS background image, and animation-play-state does not pause SMIL.
