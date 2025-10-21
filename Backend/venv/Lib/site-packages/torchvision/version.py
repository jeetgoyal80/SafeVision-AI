__version__ = '0.24.0+cpu'
git_version = '7a9db90e9aadea3e3e1fec35969601167e9efd4f'
from torchvision.extension import _check_cuda_version
if _check_cuda_version() > 0:
    cuda = _check_cuda_version()
