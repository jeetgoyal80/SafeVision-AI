from typing import Optional

__all__ = ['__version__', 'debug', 'cuda', 'git_version', 'hip', 'xpu']
__version__ = '2.9.0+cpu'
debug = False
cuda: Optional[str] = None
git_version = '0fabc3ba44823f257e70ce397d989c8de5e362c1'
hip: Optional[str] = None
xpu: Optional[str] = None
